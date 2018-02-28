FROM node:8-alpine AS base

# Make a directory for our source and build artifacts
RUN mkdir -p /home/cboard/build
WORKDIR /home/cboard

# Copy only the package.json file so we can install and cache dependencies
COPY package.json /home/cboard



# --- Create "dependencies" intermediate stage

FROM base AS dependencies
RUN npm set progress=false

# Install only modules listed in "dependencies" in package.json
RUN npm install --only=production

# Cache the runtime dependencies for later stage
RUN cp -R node_modules prod_node_modules

# Install all runtime and dev dependencies for building the code
RUN npm install

# --- End "dependencies" stage



# --- Create the "build" intermediate stage

FROM dependencies AS build
COPY . .
RUN npm run build

# --- End "build" stage



# --- Create the "release" image without devDependencies

FROM base AS release
COPY --from=dependencies /home/cboard/prod_node_modules ./node_modules
COPY --from=build /home/cboard/build ./build

RUN npm install -g serve

EXPOSE 5000

CMD ["serve", "-s", "build"]

# --- End "release" stage