ng build --prod
kubectl config use-context minikube
eval $(minikube docker-env)
docker build -t photo-app-ui:ist .
