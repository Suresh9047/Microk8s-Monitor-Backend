const NEXUS_URL = process.env.NEXUS_URL || "https://nexus.arffy.com";
const NEXUS_USERNAME = process.env.NEXUS_USERNAME;
const NEXUS_PASSWORD = process.env.NEXUS_PASSWORD;

const https = require('https');

// Bypass SSL validation for internal self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const https = require('https');
// const agent = new https.Agent({ rejectUnauthorized: false }); // Unused by native fetch

class NexusService {

    getBasicAuthHeader() {
        if (NEXUS_USERNAME && NEXUS_PASSWORD) {
            const token = Buffer.from(`${NEXUS_USERNAME}:${NEXUS_PASSWORD}`).toString('base64');
            return { 'Authorization': `Basic ${token}` };
        }
        return {};
    }

    async fetchWithAuth(url) {
        // FORCE Basic Auth immediately. 
        // "Registry Realm" usually means standard Basic Auth is expected.
        const headers = {
            'Accept': 'application/json',
            ...this.getBasicAuthHeader()
        };

        console.log(`[NexusService] Fetching: ${url}`);

        // Pass 'agent' to fetch if running in Node (requires node-fetch v2 compatible or custom config)
        // Note: Native 'fetch' in Node 18/20 might not support 'agent' directly in the same way as node-fetch.
        // If native fetch is used, we define 'dispatcher' for undici, but for simplicity let's try standard fetch 
        // with aggressive headers first. If SSL error occurs, we might need a custom dispatcher.

        // Since we are using Node's native fetch (likely), we can't easily disable SSL without global config or undici dispatcher.
        // However, 401 means SSL is fine, Auth is the issue.

        const response = await fetch(url, { headers });
        return response;
    }


    async getCatalog() {
        try {
            // Ensure no trailing slash issues
            const baseUrl = NEXUS_URL.replace(/\/$/, "");
            const url = `${baseUrl}/v2/_catalog`;

            const response = await this.fetchWithAuth(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[NexusService] Catalog Error ${response.status}: ${errorText}`);

                // Critical: If 401, return the REAL error so user knows credentials are wrong
                if (response.status === 401) {
                    return { error: `Unauthorized: Valid Credentials Required for ${NEXUS_URL}` };
                }
                throw new Error(`Failed to fetch catalog: ${response.status}`);
            }

            const data = await response.json();
            return data.repositories || [];
        } catch (error) {
            console.error("[NexusService] Catalog Exception:", error.message);
            // Only mock if it's a connection error (not an auth error)
            // return ["mock-image-1", "mock-image-2"]; 
            return { error: error.message };
        }
    }


    async getTags(imageName) {
        try {
            const baseUrl = NEXUS_URL.replace(/\/$/, "");
            const url = `${baseUrl}/v2/${imageName}/tags/list`;

            const response = await this.fetchWithAuth(url);

            if (!response.ok) {
                console.warn(`[NexusService] Tags Error for ${imageName}: ${response.status}`);
                return [];
            }

            const data = await response.json();
            return data.tags || [];
        } catch (error) {
            console.error(`[NexusService] Tags Exception for ${imageName}:`, error.message);
            return [];
        }
    }

    async getAllImagesWithTags(user) {
        const repositories = await this.getCatalog();

        // Check if getCatalog returned an error object
        if (repositories.error) {
            return { error: repositories.error };
        }

        if (!Array.isArray(repositories)) {
            return { error: "Invalid response from Nexus" };
        }

        const promises = repositories.map(async (repo) => {
            const tags = await this.getTags(repo);
            return {
                image: repo,
                tags: tags
            };
        });

        const results = await Promise.all(promises);
        return results;
    }

    async getManifestDigest(imageName, tag) {
        try {
            const baseUrl = NEXUS_URL.replace(/\/$/, "");
            const url = `${baseUrl}/v2/${imageName}/manifests/${tag}`;

            // Support Docker V2, Manifest Lists, and OCI Indices/Manifests
            const headers = {
                'Accept': 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json',
                ...this.getBasicAuthHeader()
            };

            console.log(`[NexusService] Fetching Manifest: ${url}`);
            const response = await fetch(url, { headers });

            if (!response.ok) {
                const text = await response.text();
                console.warn(`[NexusService] Manifest Error ${response.status} for ${imageName}:${tag}`);
                console.warn(`[NexusService] Response Body: ${text}`);
                console.warn(`[NexusService] Response Headers:`, JSON.stringify([...response.headers.entries()]));
                return null;
            }

            // Log successful digest retrieval for debugging
            const digest = response.headers.get("docker-content-digest");
            console.log(`[NexusService] Got Digest for ${imageName}:${tag} -> ${digest}`);
            return digest;
        } catch (error) {
            console.error(`[NexusService] Manifest Exception:`, error.message);
            return null;
        }
    }

    
    async deleteImageTag(imageName, tag) {

        try {
            // 1. Get Digest
            const digest = await this.getManifestDigest(imageName, tag);
            if (!digest) {
                return { error: "Image manifest not found or digest not retrievable" };
            }

            // 2. Delete using digest
            const baseUrl = NEXUS_URL.replace(/\/$/, "");
            const url = `${baseUrl}/v2/${imageName}/manifests/${digest}`;

            const headers = {
                ...this.getBasicAuthHeader()
            };

            const response = await fetch(url, {
                method: 'DELETE',
                headers
            });

            if (response.ok || response.status === 202) {
                return { success: true };
            } else {
                const text = await response.text();
                return { error: `Failed to delete from Nexus: ${response.status} - ${text}` };
            }
        } catch (error) {
            console.error(`[NexusService] Delete Exception:`, error.message);
            return { error: error.message };
        }
    }
}


module.exports = new NexusService();
