"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Namespaces
    await queryInterface.bulkInsert("namespaces", [
      {
        name: "default",
        status: "Active",
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "kube-system",
        status: "Active",
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "marketing-prod",
        status: "Active",
        created_at: new Date(),
        created_by: 1,
      },
    ]);

    // 2. Deployments
    await queryInterface.bulkInsert("deployments", [
      {
        name: "nginx-deployment",
        namespace: "default",
        replicas: 3,
        image: "nginx:1.14.2",
        status: "Running",
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "frontend-app",
        namespace: "marketing-prod",
        replicas: 2,
        image: "arffy-tech/frontend:v2.0",
        status: "Running",
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "backend-api",
        namespace: "marketing-prod",
        replicas: 1,
        image: "arffy-tech/backend:v1.5",
        status: "CrashLoopBackOff",
        created_at: new Date(),
        created_by: 1,
      },
    ]);

    // 3. Services
    await queryInterface.bulkInsert("k8s_services", [
      {
        name: "nginx-service",
        namespace: "default",
        type: "ClusterIP",
        cluster_ip: "10.96.0.1",
        ports: "80:8080",
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "frontend-lb",
        namespace: "marketing-prod",
        type: "LoadBalancer",
        cluster_ip: "10.96.14.2",
        ports: "443:8443",
        created_at: new Date(),
        created_by: 1,
      },
    ]);

    // 4. Ingress
    await queryInterface.bulkInsert("ingresses", [
      {
        name: "main-ingress",
        namespace: "marketing-prod",
        rules: "host: arffy.tech, path: /",
        address: "203.0.113.10",
        created_at: new Date(),
        created_by: 1,
      },
    ]);

    // 5. Secrets
    await queryInterface.bulkInsert("secrets", [
      {
        name: "db-credentials",
        namespace: "marketing-prod",
        type: "Opaque",
        expiry_date: null,
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "tls-cert-prod",
        namespace: "marketing-prod",
        type: "kubernetes.io/tls",
        expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires in 1 year
        created_at: new Date(),
        created_by: 1,
      },
      {
        name: "expired-cert-dev",
        namespace: "default",
        type: "kubernetes.io/tls",
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Expired 1 month ago
        created_at: new Date(),
        created_by: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('namespaces', null, {});
    await queryInterface.bulkDelete('deployments', null, {});
    await queryInterface.bulkDelete('k8s_services', null, {});
    await queryInterface.bulkDelete('ingresses', null, {});
    await queryInterface.bulkDelete('secrets', null, {});
  },
};
