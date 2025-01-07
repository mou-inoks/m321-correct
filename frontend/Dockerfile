FROM nginx:alpine
COPY . /usr/share/nginx/html

# expose port 80
EXPOSE 80
EXPOSE 49153

# run nginx
CMD ["nginx", "-g", "daemon off;"]