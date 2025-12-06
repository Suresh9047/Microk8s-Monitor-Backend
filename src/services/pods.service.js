const k8s = require("@kubernetes/client-node");
const path = require("path");
const fs = require("fs");

class PodsService {
  constructor() {
    this.kc = new k8s.KubeConfig();
    const configPath = path.join(__dirname, "../../kube_config.yaml");

    if (fs.existsSync(configPath)) {
      this.kc.loadFromFile(configPath);
      console.log(`[PodsService] Loaded config from ${configPath}`);
    } else {
      console.warn(
        "[PodsService] kube_config.yaml not found, attempting default load"
      );
      this.kc.loadFromDefault();
    }

    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  /**
   * List pods with advanced filtering and metrics
   * @param {Object} filters - { namespace, phase, nodeName, label.* }
   * @returns {Array} List of pods with metrics
   */
  async listPods(filters = {}) {
    try {
      const { namespace, phase, nodeName } = filters;
      let res;

      // Fetch pods based on namespace filter
      // Check for non-empty string namespace
      if (namespace && namespace.trim() !== "") {
        res = await this.k8sApi.listNamespacedPod({ namespace });
      } else {
        res = await this.k8sApi.listPodForAllNamespaces({});
      }

      const items = res.body ? res.body.items : res.items;
      if (!items) return [];

      // Fetch metrics for all pods
      const metrics = await this._fetchPodMetrics();

      // Apply filters
      let filteredPods = items;

      // Filter by phase (Running, Pending, Failed, Succeeded, etc.)
      if (phase) {
        filteredPods = filteredPods.filter((pod) => pod.status.phase === phase);
      }

      // Filter by node name
      if (nodeName) {
        filteredPods = filteredPods.filter(
          (pod) => pod.spec.nodeName === nodeName
        );
      }

      // Filter by labels (e.g., filters["label.app"] = "nginx")
      Object.keys(filters).forEach((key) => {
        if (key.startsWith("label.")) {
          const labelKey = key.substring(6); // Remove "label." prefix
          const labelValue = filters[key];
          filteredPods = filteredPods.filter((pod) => {
            const podLabels = pod.metadata.labels || {};
            return podLabels[labelKey] === labelValue;
          });
        }
      });

      // Map to response format matching frontend spec
      return filteredPods.map((pod) => {
        const podMetrics = metrics.find(
          (m) =>
            m.name === pod.metadata.name &&
            m.namespace === pod.metadata.namespace
        );

        return {
          id: pod.metadata.uid,
          name: pod.metadata.name,
          namespace: pod.metadata.namespace,
          status: this._getStatus(pod),
          phase: pod.status.phase,
          age: this._calculateAge(pod.metadata.creationTimestamp),
          cpu: podMetrics?.cpu || "0m",
          memory: podMetrics?.memory || "0Mi",
          restarts: this._getTotalRestartCount(pod),
          nodeName: pod.spec.nodeName,
        };
      });
    } catch (err) {
      console.error("[PodsService] Error listing pods:", err);
      return { error: err.message };
    }
  }

  /**
   * Get detailed information about a specific pod
   * @param {string} namespace - Pod namespace
   * @param {string} name - Pod name
   * @returns {Object} Pod details with events
   */
  async getPodDetails(namespace, name) {
    try {
      // Fetch pod details
      // IMPORTANT: K8s API expects object param!
      const podRes = await this.k8sApi.readNamespacedPod({ name, namespace });
      const pod = podRes.body || podRes;

      // Fetch pod events
      const eventsRes = await this.k8sApi.listNamespacedEvent({
        namespace,
        fieldSelector: `involvedObject.name=${name},involvedObject.kind=Pod`,
      });
      const events = eventsRes.body ? eventsRes.body.items : eventsRes.items;

      // Fetch metrics for this pod
      const metrics = await this._fetchPodMetrics(namespace);
      const podMetrics = metrics.find((m) => m.name === name);

      // Sort events by timestamp (newest first) and limit to 20
      const sortedEvents = events
        ? events
            .sort((a, b) => {
              const timeA = new Date(a.lastTimestamp || a.firstTimestamp);
              const timeB = new Date(b.lastTimestamp || b.firstTimestamp);
              return timeB - timeA; // Newest first
            })
            .slice(0, 20)
            .map((e) => ({
              type: e.type,
              reason: e.reason,
              message: e.message,
              timestamp: e.lastTimestamp || e.firstTimestamp,
              count: e.count,
            }))
        : [];

      // Build response matching frontend spec
      return {
        id: pod.metadata.uid,
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: this._getStatus(pod),
        phase: pod.status.phase,
        age: this._calculateAge(pod.metadata.creationTimestamp),
        cpu: podMetrics?.cpu || "0m",
        memory: podMetrics?.memory || "0Mi",
        restarts: this._getTotalRestartCount(pod),
        nodeName: pod.spec.nodeName,
        uid: pod.metadata.uid,
        labels: pod.metadata.labels || {},
        annotations: pod.metadata.annotations || {},
        conditions: (pod.status.conditions || []).map((c) => ({
          type: c.type,
          status: c.status,
          lastProbeTime: c.lastProbeTime || null,
          lastTransitionTime: c.lastTransitionTime,
          reason: c.reason,
          message: c.message,
        })),
        containers: pod.spec.containers.map((c, idx) => {
          const containerStatus = pod.status.containerStatuses?.find(
            (cs) => cs.name === c.name
          );
          return {
            name: c.name,
            image: c.image,
            state: this._getContainerState(containerStatus),
            ready: containerStatus?.ready || false,
            restartCount: containerStatus?.restartCount || 0,
            ports: c.ports || [],
            resources: c.resources || { requests: {}, limits: {} },
          };
        }),
        events: sortedEvents,
        ownerReferences: pod.metadata.ownerReferences || [],
        qosClass: pod.status.qosClass || "BestEffort",
        podIP: pod.status.podIP || null,
        hostIP: pod.status.hostIP || null,
        createdAt: pod.metadata.creationTimestamp,
      };
    } catch (err) {
      console.error(
        `[PodsService] Error fetching pod details for ${namespace}/${name}:`,
        err
      );
      return { error: err.message };
    }
  }

  /**
   * Get logs from a specific container in a pod - return plain text
   * @param {string} namespace - Pod namespace
   * @param {string} name - Pod name
   * @param { Object} options - { container, tailLines, timestamps, sinceSeconds }
   * @returns {string} Pod logs as plain text
   */
  async getPodLogs(namespace, name, options = {}) {
    try {
      const { container, tailLines, timestamps, sinceSeconds } = options;

      // Validate container name
      // Fetch pod to check if container exists, otherwise default to first container
      // This handles cases where frontend sends pod name as container name
      let targetContainer = container;
      try {
        const podRes = await this.k8sApi.readNamespacedPod({ name, namespace });
        const pod = podRes.body || podRes;

        if (!pod || !pod.spec) {
          throw new Error("Pod spec not found");
        }

        const validContainers = pod.spec.containers.map((c) => c.name);

        if (pod.spec.initContainers) {
          validContainers.push(...pod.spec.initContainers.map((c) => c.name));
        }

        if (!targetContainer || !validContainers.includes(targetContainer)) {
          console.warn(
            `[PodsService] Container '${targetContainer}' not found in pod '${name}'. Defaulting to '${validContainers[0]}'`
          );
          targetContainer = validContainers[0];
        }
      } catch (err) {
        console.warn(
          "[PodsService] Failed to validate container name:",
          err.message
        );
        // If we can't fetch pod, proceed with original container name (or undefined)
      }

      // IMPORTANT: K8s API expects object param!
      const logRes = await this.k8sApi.readNamespacedPodLog({
        name,
        namespace,
        container: targetContainer,
        tailLines,
        timestamps,
        sinceSeconds,
      });

      // Return plain text logs as per spec
      return logRes.body || logRes;
    } catch (err) {
      console.error(
        `[PodsService] Error fetching logs for ${namespace}/${name}:`,
        err
      );
      throw new Error(err.message);
    }
  }

  /**
   * Delete a pod
   * @param {string} namespace - Pod namespace
   * @param {string} name - Pod name
   * @returns {Object} Success response
   */
  async deletePod(namespace, name) {
    try {
      await this.k8sApi.deleteNamespacedPod(name, namespace);
      return {
        success: true,
        message: "Pod deleted successfully",
      };
    } catch (err) {
      console.error(
        `[PodsService] Error deleting pod ${namespace}/${name}:`,
        err
      );
      return {
        success: false,
        message: `Failed to delete pod: ${err.message}`,
      };
    }
  }

  // Helper methods
  _parseLabels(labelString) {
    // Parse "app=nginx,version=v1" into [{key: "app", value: "nginx"}, ...]
    return labelString.split(",").map((label) => {
      const [key, value] = label.split("=");
      return { key: key.trim(), value: value.trim() };
    });
  }

  _getTotalRestartCount(pod) {
    if (!pod.status.containerStatuses) return 0;
    return pod.status.containerStatuses.reduce(
      (sum, c) => sum + (c.restartCount || 0),
      0
    );
  }

  _isContainerReady(pod, containerName) {
    if (!pod.status.containerStatuses) return false;
    const containerStatus = pod.status.containerStatuses.find(
      (c) => c.name === containerName
    );
    return containerStatus ? containerStatus.ready : false;
  }

  _calculateAge(creationTimestamp) {
    const created = new Date(creationTimestamp);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return `${diffMins}m`;
  }

  _getStatus(pod) {
    const phase = pod.status.phase;
    if (phase === "Running") {
      const allReady = pod.status.containerStatuses?.every((c) => c.ready);
      return allReady ? "Active" : "Running";
    }
    if (phase === "Succeeded") return "Succeeded";
    if (phase === "Failed") return "Failed";
    if (phase === "Pending") return "Pending";
    return phase;
  }

  _getContainerState(containerStatus) {
    if (!containerStatus) return "waiting";
    if (containerStatus.state.running) return "running";
    if (containerStatus.state.terminated) return "terminated";
    return "waiting";
  }

  /**
   * Fetch pod metrics from Metrics Server API
   * @param {string} namespace - Optional namespace filter
   * @returns {Array} Array of pod metrics
   */
  async _fetchPodMetrics(namespace = null) {
    try {
      const customApi = this.kc.makeApiClient(k8s.CustomObjectsApi);
      let metricsData;

      if (namespace && namespace.trim() !== "") {
        metricsData = await customApi.listNamespacedCustomObject({
          group: "metrics.k8s.io",
          version: "v1beta1",
          namespace,
          plural: "pods",
        });
      } else {
        // List all pod metrics across all namespaces
        const namespaces = await this.k8sApi.listNamespace();
        const allMetrics = [];

        for (const ns of namespaces.body.items) {
          try {
            const nsMetrics = await customApi.listNamespacedCustomObject({
              group: "metrics.k8s.io",
              version: "v1beta1",
              namespace: ns.metadata.name,
              plural: "pods",
            });
            const items = nsMetrics.body
              ? nsMetrics.body.items
              : nsMetrics.items;
            if (items) {
              allMetrics.push(...items);
            }
          } catch (err) {
            // Skip namespaces without metrics
            continue;
          }
        }

        metricsData = { body: { items: allMetrics } };
      }

      const items = metricsData.body
        ? metricsData.body.items
        : metricsData.items;
      if (!items) return [];

      return items.map((item) => {
        // Sum CPU and memory across all containers
        let totalCpu = 0;
        let totalMemory = 0;

        item.containers.forEach((container) => {
          totalCpu += this._parseCpu(container.usage.cpu);
          totalMemory += this._parseMemory(container.usage.memory);
        });

        return {
          name: item.metadata.name,
          namespace: item.metadata.namespace,
          cpu: this._formatCpu(totalCpu),
          memory: this._formatMemory(totalMemory),
        };
      });
    } catch (err) {
      console.warn("[PodsService] Metrics Server not available:", err.message);
      return []; // Return empty array if metrics server is not available
    }
  }

  _parseCpu(cpuString) {
    // Parse CPU value like "12m" or "0.012"
    if (cpuString.endsWith("n")) {
      return parseInt(cpuString) / 1000000000;
    }
    if (cpuString.endsWith("u")) {
      return parseInt(cpuString) / 1000000;
    }
    if (cpuString.endsWith("m")) {
      return parseInt(cpuString) / 1000;
    }
    return parseFloat(cpuString);
  }

  _parseMemory(memString) {
    // Parse memory value like "142Mi" or "1024Ki"
    if (memString.endsWith("Ki")) {
      return parseInt(memString) / 1024;
    }
    if (memString.endsWith("Mi")) {
      return parseInt(memString);
    }
    if (memString.endsWith("Gi")) {
      return parseInt(memString) * 1024;
    }
    return parseInt(memString) / (1024 * 1024); // Assume bytes
  }

  _formatCpu(cpuCores) {
    // Convert CPU cores to millicores
    const milliCores = Math.round(cpuCores * 1000);
    return `${milliCores}m`;
  }

  _formatMemory(memoryMi) {
    // Format memory in Mi
    return `${Math.round(memoryMi)}Mi`;
  }
}

module.exports = new PodsService();
