
# Setup:
#   yarn install --dev
#   npx netlify login
#
# Create a site with, e.g.:
#   npx netlify sites:create --name sidecar-ninja-prod

.PHONY: build-production
build-production:
	[ ! -d build ] || rm -rf build
	REACT_APP_NAMETAG_SERVER=https://nametag.co \
		REACT_APP_NAMETAG_CLIENT_ID="6f9434c1-4f0b-45dc-98c5-6224f1c23459" \
		yarn build
	npx netlify deploy --site=example.nametag.co --prod --dir build

.PHONY: build-staging
build-staging:
	[ ! -d build ] || rm -rf build
	REACT_APP_NAMETAG_SERVER=https://nametagstaging.com \
	REACT_APP_NAMETAG_CLIENT_ID="55578457-e684-464d-9366-1ca6c329f74f" \
	yarn build
	npx netlify deploy --site=sidecar.ninja --prod --dir build
