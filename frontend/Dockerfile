FROM nginx

#COPY ../nginx.conf /etc/nginx/conf.d    

COPY index.html /usr/share/nginx/html
COPY styles.css /usr/share/nginx/html
COPY scripts.js /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]