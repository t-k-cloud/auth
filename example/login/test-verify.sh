#!/bin/sh
curl -v -H "Content-Type: application/json" -d \
	'{"token": "abc"}' \
	"http://localhost/auth/token_verify"
