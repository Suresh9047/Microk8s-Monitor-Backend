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
    }

    async getNamespaces() {
        try {
            const res = await this.k8sApi.listNamespace();
            const items = res.body ? res.body.items : res.items;

            if (!items) {
                console.warn("[K8sService] No items found in namespace response:", res);
                return [];
            }

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

    async getPods(namespace = 'default') {
        try {
            const res = await this.k8sApi.listNamespacedPod(namespace);
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
            const res = await this.k8sApi.listPodForAllNamespaces();
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
}

module.exports = new K8sService();
