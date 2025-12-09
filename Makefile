.PHONY: web workers backend

web:
	./scripts/web.sh

workers:
	./scripts/workers.sh

backend: 
	source .venv/bin/activate && uvicorn backend.main:app --reload