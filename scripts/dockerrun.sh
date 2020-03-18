#!/bin/sh
read -r -p "Do you want to create database tables? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY]) 
        npm run db-create 
        ;;
    *)
        echo "OK"
        ;;
esac

read -r -p "Do you want to seed the database? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY]) 
        npm run db-seed 
        ;;
    *)
        echo "OK"
        ;;
esac

npm start