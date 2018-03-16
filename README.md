# README
If use Nginx rewrite, the original URI information is lost, we need to write
a self-defined header field to save this information such that redirector can
tell the authd which URL to go back if the login succeeds.
```
location /example/ {
	proxy_pass http://localhost:8080;
	rewrite /example/(.*) /$1 break;
	proxy_set_header X-original-uri /example/$1;
}   
location /auth/ {
	proxy_pass http://localhost:3000;
	rewrite /auth/(.*) /$1 break;
}  
```
