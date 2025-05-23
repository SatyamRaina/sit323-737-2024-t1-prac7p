# SIT323/737–2024–T1–Prac7P: Calculator Microservice on Kubernetes

This project demonstrates a scalable calculator microservice architecture deployed using Kubernetes. It performs basic arithmetic operations and stores calculation records in MongoDB. This practical task showcases containerization, Kubernetes deployment, and service integration within a Minikube cluster.

<pre> ## 📦 Project Structure 
├── calculator-deployment.yml # Deployment for calculator microservice 
├── calculator-service.yml # NodePort service to expose calculator API 
├── mongo-deployment.yml # MongoDB deployment with persistent volume 
├── mongo-pvc.yml # Persistent Volume Claim for MongoDB 
├── mongo-configmap.yml # MongoDB initialization script 
├── test.js # Calculator microservice (Node.js + Express + Mongoose) 
├── package.json # Node dependencies 
├── Dockerfile # Docker build for calculator microservice 
├── .gitignore # Ignore node_modules and other unnecessary files 
</pre>

## 🚀 How to Run Locally Using Minikube

1. **Start Minikube Cluster**
   ```bash
   minikube start
2. **Apply Kubernetes Configurations**
   ```bash
    kubectl apply -f mongo-configmap.yml
    kubectl apply -f mongo-pvc.yml
    kubectl apply -f mongo-deployment.yml
    kubectl apply -f calculator-deployment.yml
    kubectl apply -f calculator-service.yml
3. **Access Calculator API**
   ```bash
    minikube service calculator-service --url
4. Use the generated URL in Postman or browser, e.g.:
   ```bash
   http://<minikube-ip>:<node-port>/add?n1=5&n2=10
   
**🧪MongoDB Verification**

To verify if calculations are stored:
```bash
kubectl exec -it <mongo-pod-name> -- mongosh -u admin -p admin123 --authenticationDatabase calculator
> use calculator
> db.calculations.find().pretty()
```
**📸 Screenshots**

Refer to the screenshots/ folder to view:

1. Microservice successfully running
2. Postman API tests
3. MongoDB record verification

