# Use the official MySQL base image
FROM mysql:latest

# Copy SQL scripts to initialize the database
COPY schema.sql /docker-entrypoint-initdb.d/
