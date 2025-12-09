const k8s = require('@kubernetes/client-node');
const path = require('path');
const fs = require('fs');

class K8sService {
    constructor() {
        this.kc = new k8s.KubeConfig();
        // Load config from the file we just saved
        // In a real app, maybe process.env.KUBECONFIG or default loadFromDefault()
        const configPath = path.join(__dirname, '../../kube_config.yaml');

        if (fs.existsSync(configPath)) {
            this.kc.loadFromFile(configPath);
            console.log(`[K8sService] Loaded config from ${configPath}`);
        } else {
            // Fallback or default
            console.warn("[K8sService] kube_config.yaml not found, attempting default load");
            this.kc.loadFromDefault();
        }

        this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
        this.k8sAppsApi = this.kc.makeApiClient(k8s.AppsV1Api);
        this.k8sNetworkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
    }

    async getNamespaces() {
        try {
            const res = await this.k8sApi.listNamespace({});
            const items = res.body ? res.body.items : res.items;
            return items.map(ns => ({
                name: ns.metadata.name,
                status: ns.status.phase,
                creationTimestamp: ns.metadata.creationTimestamp
            }));
        } catch (err) {
            console.error('[K8sService] Error fetching namespaces:', err);
            return { error: err.message };
        }
    }

    async createNamespace(manifest) {
        try {
            const res = await this.k8sApi.createNamespace({ body: manifest });
            return res.body; // or res
        } catch (err) {
            console.error('[K8sService] Error creating namespace:', err);
            return { error: err.message };
        }
    }

    async deleteNamespace(name) {
        try {
            const res = await this.k8sApi.deleteNamespace({ name });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error deleting namespace:', err);
            return { error: err.message };
        }
    }

    async getPods(namespace = 'default') {
        try {
            const res = await this.k8sApi.listNamespacedPod({ namespace });
            const items = res.body ? res.body.items : res.items;

            if (!items) return [];

            return items.map(pod => ({
                name: pod.metadata.name,
                namespace: pod.metadata.namespace,
                status: pod.status.phase,
                ip: pod.status.podIP,
                startTime: pod.status.startTime,
                image: pod.spec.containers.map(c => c.image)
            }));
        } catch (err) {
            console.error(`[K8sService] Error fetching pods for ${namespace}:`, err);
            return { error: err.message };
        }
    }

    async getAllPods() {
        try {
            const res = await this.k8sApi.listPodForAllNamespaces({});
            const items = res.body ? res.body.items : res.items;

            if (!items) return [];

            return items.map(pod => ({
                name: pod.metadata.name,
                namespace: pod.metadata.namespace,
                status: pod.status.phase,
                ip: pod.status.podIP,
                startTime: pod.status.startTime
            }));
        } catch (err) {
            console.error(`[K8sService] Error fetching all pods:`, err);
            return { error: err.message };
        }
    }

    async getPodLogs(namespace, podName) {
        try {
            // readNamespacedPodLog(name, namespace, container, follow, limitBytes, pretty, previous, sinceSeconds, tailLines, timestamps)
            // Note: In newer client versions, arguments might need to be an object or positional. 
            // Checking the library source for readNamespacedPodLog implementation is tricky without running it, 
            // but usually readNamespacedPodLog is string-based.
            // However, the standard API usually returns a pure string response.

            const res = await this.k8sApi.readNamespacedPodLog({
                name: podName,
                namespace: namespace
            });

            // The response for logs is just the string body in some versions, or res.body
            return res.body !== undefined ? res.body : res;
        } catch (err) {
            console.error(`[K8sService] Error fetching logs for ${podName}:`, err);
            return { error: err.message || "Failed to fetch logs" };
        }
    }

    // --- Deployments ---
    async getDeployments(namespace) {
        try {
            console.log(`[K8sService] getDeployments called for namespace: ${namespace}`);
            let res;
            if (namespace) {
                res = await this.k8sAppsApi.listNamespacedDeployment({ namespace });
            } else {
                res = await this.k8sAppsApi.listDeploymentForAllNamespaces({});
            }
            // Use res.body if available, otherwise assume res is the body (for some client versions)
            // Or items might be directly on res if it's not wrapped in 'body' property in all cases.
            const body = res.body || res;
            const items = body.items || [];

            console.log(`[K8sService] listDeployment items found:`, items.length);

            return items.map(d => ({
                name: d.metadata?.name,
                namespace: d.metadata?.namespace,
                replicas: d.spec?.replicas,
                availableReplicas: d.status?.availableReplicas,
                creationTimestamp: d.metadata?.creationTimestamp
            }));
        } catch (err) {
            console.error('[K8sService] Error getting deployments:', err);
            return { error: err.message };
        }
    }

    async getDeployment(namespace, name) {
        try {
            const res = await this.k8sAppsApi.readNamespacedDeployment({ namespace, name });
            return res.body || res;
        } catch (err) {
            console.error('[K8sService] Error getting deployment:', err);
            return { error: err.message };
        }
    }

    async createDeployment(namespace, manifest) {
        try {
            const res = await this.k8sAppsApi.createNamespacedDeployment({ namespace, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error creating deployment:', err);
            return { error: err.message };
        }
    }

    async updateDeployment(namespace, name, manifest) {
        try {
            const res = await this.k8sAppsApi.replaceNamespacedDeployment({ namespace, name, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error updating deployment:', err);
            return { error: err.message };
        }
    }

    async deleteDeployment(namespace, name) {
        try {
            const res = await this.k8sAppsApi.deleteNamespacedDeployment({ namespace, name });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error deleting deployment:', err);
            return { error: err.message };
        }
    }

    // --- Services ---
    async getServices(namespace) {
        try {
            console.log(`[K8sService] getServices called for namespace: ${namespace}`);
            let res;
            if (namespace) {
                res = await this.k8sApi.listNamespacedService({ namespace });
            } else {
                res = await this.k8sApi.listServiceForAllNamespaces({});
            }

            const body = res.body || res;
            const items = body.items || [];
            console.log(`[K8sService] listService items found:`, items.length);

            return items.map(s => ({
                name: s.metadata?.name,
                namespace: s.metadata?.namespace,
                type: s.spec?.type,
                clusterIP: s.spec?.clusterIP,
                ports: s.spec?.ports,
                creationTimestamp: s.metadata?.creationTimestamp
            }));
        } catch (err) {
            console.error('[K8sService] Error getting services:', err);
            return { error: err.message };
        }
    }

    async getService(namespace, name) {
        try {
            const res = await this.k8sApi.readNamespacedService({ namespace, name });
            return res.body || res;
        } catch (err) {
            console.error('[K8sService] Error getting service:', err);
            return { error: err.message };
        }
    }

    async createService(namespace, manifest) {
        try {
            const res = await this.k8sApi.createNamespacedService({ namespace, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error creating service:', err);
            return { error: err.message };
        }
    }

    async updateService(namespace, name, manifest) {
        try {
            const res = await this.k8sApi.replaceNamespacedService({ namespace, name, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error updating service:', err);
            return { error: err.message };
        }
    }

    async deleteService(namespace, name) {
        try {
            const res = await this.k8sApi.deleteNamespacedService({ namespace, name });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error deleting service:', err);
            return { error: err.message };
        }
    }

    // --- Ingresses ---
    async getIngresses(namespace) {
        try {
            console.log(`[K8sService] getIngresses called for namespace: ${namespace}`);
            let res;
            if (namespace) {
                res = await this.k8sNetworkingApi.listNamespacedIngress({ namespace });
            } else {
                res = await this.k8sNetworkingApi.listIngressForAllNamespaces({});
            }

            const body = res.body || res;
            const items = body.items || [];
            console.log(`[K8sService] listIngress items found:`, items.length);

            return items.map(i => ({
                name: i.metadata?.name,
                namespace: i.metadata?.namespace,
                hosts: i.spec?.rules ? i.spec.rules.map(r => r.host) : [],
                creationTimestamp: i.metadata?.creationTimestamp
            }));
        } catch (err) {
            console.error('[K8sService] Error getting ingresses:', err);
            return { error: err.message };
        }
    }

    async getIngress(namespace, name) {
        try {
            const res = await this.k8sNetworkingApi.readNamespacedIngress({ namespace, name });
            return res.body || res;
        } catch (err) {
            console.error('[K8sService] Error getting ingress:', err);
            return { error: err.message };
        }
    }

    async createIngress(namespace, manifest) {
        try {
            const res = await this.k8sNetworkingApi.createNamespacedIngress({ namespace, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error creating ingress:', err);
            return { error: err.message };
        }
    }

    async updateIngress(namespace, name, manifest) {
        try {
            const res = await this.k8sNetworkingApi.replaceNamespacedIngress({ namespace, name, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error updating ingress:', err);
            return { error: err.message };
        }
    }

    async deleteIngress(namespace, name) {
        try {
            // Note: newer clients use deleteNamespacedIngress({name, namespace})
            const res = await this.k8sNetworkingApi.deleteNamespacedIngress({ namespace, name });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error deleting ingress:', err);
            return { error: err.message };
        }
    }

    // --- Secrets ---
    async getSecrets(namespace) {
        try {
            console.log(`[K8sService] getSecrets called for namespace: ${namespace}`);
            let res;
            if (namespace) {
                res = await this.k8sApi.listNamespacedSecret({ namespace });
            } else {
                res = await this.k8sApi.listSecretForAllNamespaces({});
            }

            const body = res.body || res;
            const items = body.items || [];
            console.log(`[K8sService] listSecret items found:`, items.length);

            return items.map(s => ({
                name: s.metadata?.name,
                namespace: s.metadata?.namespace,
                type: s.type,
                creationTimestamp: s.metadata?.creationTimestamp
            }));
        } catch (err) {
            console.error('[K8sService] Error getting secrets:', err);
            return { error: err.message };
        }
    }

    async getSecret(namespace, name) {
        try {
            const res = await this.k8sApi.readNamespacedSecret({ namespace, name });
            return res.body || res;
        } catch (err) {
            console.error('[K8sService] Error getting secret:', err);
            return { error: err.message };
        }
    }

    async createSecret(namespace, manifest) {
        try {
            const res = await this.k8sApi.createNamespacedSecret({ namespace, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error creating secret:', err);
            return { error: err.message };
        }
    }

    async updateSecret(namespace, name, manifest) {
        try {
            const res = await this.k8sApi.replaceNamespacedSecret({ namespace, name, body: manifest });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error updating secret:', err);
            return { error: err.message };
        }
    }

    async deleteSecret(namespace, name) {
        try {
            const res = await this.k8sApi.deleteNamespacedSecret({ namespace, name });
            return res.body;
        } catch (err) {
            console.error('[K8sService] Error deleting secret:', err);
            return { error: err.message };
        }
    }
}

module.exports = new K8sService();
