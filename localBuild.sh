ng build --prod
eval $(minikube docker-env)
docker build -t photo-app-ui:ist .
