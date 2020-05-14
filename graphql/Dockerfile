FROM node:14.2.0-alpine3.11
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://github.com/graphile/postgraphile"

RUN npm install -g postgraphile@4.7.0
RUN npm install -g postgraphile-plugin-connection-filter@1.1.3

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]