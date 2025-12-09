import os
import modal

app = modal.App(name=os.environ.get("MODAL_APP_NAME", "scope"))

image = (
    modal.Image.debian_slim()
    .uv_sync()
    .add_local_dir("./backend", remote_path="/root/backend")
)

@app.function(
    image=image,
    scaledown_window=180
)
@modal.asgi_app()
def modal_app():
    from backend.main import app as fastapi_app
    return fastapi_app
