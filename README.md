# Petualangan Energi Bersama Sahabat IPA - Kelas 4 SD

## 1. Project Overview

Petualangan Energi Bersama Sahabat IPA is an educational website designed for Grade 4 elementary school students. The website helps students learn about energy through interactive learning materials and educational activities.

This project is containerized using Docker and served through Nginx, making it easier to build, run, and test the application in a consistent environment.

## 2. Main Features

- Educational content about energy for Grade 4 students.
- Interactive learning activities and educational games.
- Video-based learning materials.
- A web interface accessible through a browser.
- Docker-based deployment using Docker Compose.
- An HTTP health check endpoint to verify service availability.

## 3. Prerequisites

Make sure the following tools are installed:

- Git
- Docker Desktop
- Docker Compose (included with Docker Desktop)

The project uses Docker to build the application image and Nginx to serve the website.

## 4. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/syardiya/elementary-science-gamification.git
cd elementary-science-gamification
```

Switch to the Dockerization branch:

```bash
git checkout chore/dockerize-project
```

## 5. Environment Configuration

Create a local `.env` file from the provided example file.

On Windows PowerShell, run:

```powershell
Copy-Item .env.example .env
```

On Linux or macOS, run:

```bash
cp .env.example .env
```

The `.env.example` file contains the following environment variables:

| Variable | Example Value | Description |
|---|---|---|
| `APP_NAME` | `elementary-science-gamification` | Application name used in the health check response. |
| `APP_ENV` | `production` | Application environment. |
| `HOST_PORT` | `8080` | Port exposed on the host machine. |
| `CONTAINER_PORT` | `80` | Port used by Nginx inside the container. |

The default configuration maps host port `8080` to container port `80`.

The `.env` file is used for local configuration. Do not commit this file if it contains private information or secrets. Keep `.env.example` available as a template without sensitive values.

## 6. Build and Run the Application

Make sure Docker Desktop is running and open a terminal in the project root directory.

Build the Docker image and start the application in the background:

```bash
docker compose up --build -d
```

The Docker image is configured with the following name:

```text
group07/elementary-science-gamification:week6
```

Check the status of the running container:

```bash
docker compose ps
```

The web service should be running.

## 7. Access the Application

Open the following URL in a web browser:

**Application URL:** http://localhost:8080

**Health Check URL:** http://localhost:8080/healthz

The health check endpoint should return an HTTP 200 response with a message indicating that the application is running and healthy.

The application URL assumes that `HOST_PORT=8080` in the `.env` file. If a different host port is configured, use that port in the browser URL.

## 8. Verification and Testing

The following checks can be used to verify the Dockerized application.

| Check ID | Verification Action | Expected Result |
|---|---|---|
| V-01 | Run `docker compose ps`. | The application container is running. |
| V-02 | Open `http://localhost:8080/healthz` in a browser. | The endpoint returns HTTP 200 and a healthy status message. |
| V-03 | Open the website and test one core learning activity or game. | The selected feature works as expected. |
| V-04 (Optional) | Restart the container and access the website again. | The application becomes available after restarting. |

Record the actual result of each test and save screenshots as evidence for the project report.

## 9. Logs and Container Management

### View Application Logs

Display the container logs:

```bash
docker compose logs
```

Follow the logs continuously:

```bash
docker compose logs -f
```

### Restart the Application

```bash
docker compose restart
```

### Stop the Application

```bash
docker compose stop
```

### Start the Application Again

```bash
docker compose start
```

### Check Container Status

```bash
docker compose ps
```

## 10. Stop and Clean Up

To stop the application and remove the containers and network created by Docker Compose, run:

```bash
docker compose down
```

This command does not normally delete the project's source files or the built Docker image.

To run the application again, use:

```bash
docker compose up -d
```

## 11. Troubleshooting

### Docker Is Not Running

Make sure Docker Desktop is open and the Docker engine has started. Retry the command after Docker is ready.

### The Application Cannot Be Opened

Check the container status:

```bash
docker compose ps
```

Review the application logs:

```bash
docker compose logs
```

Confirm that the application container is running and that the host port matches the URL used in the browser.

### The Environment File Is Missing

Make sure `.env` exists in the project root directory. If it does not exist, create it from `.env.example`.

### The Host Port Is Already in Use

Another application may be using the configured host port. Stop the conflicting application or change `HOST_PORT` in the local `.env` file to an available port.

For example:

```text
HOST_PORT=8081
CONTAINER_PORT=80
```

If you change the host port to `8081`, access the application at `http://localhost:8081`.

## 12. Known Limitations

- The application is a static website served by Nginx.
- The health check confirms that Nginx can respond to the health endpoint, but it does not test every website feature.
- The application requires its website files and assets to be available in the Docker image.
- The website must be accessed through the configured host port.

## 13. Project Notes

- Run Docker Compose commands from the project root directory.
- Keep local environment configuration in `.env`.
- Use `.env.example` to document the required environment variables.
- Do not commit passwords, tokens, or other sensitive information.
- Save screenshots of the verification steps for the project report.

## 14. Handover Test

| Verifier : Theresia Sgeryl, Group 06, IS Class3 |
| Device / OS : Windows 11|
| Fresh clone  :Successful |
| Image build : Successful |
| Application start : uccessful |
| Core function | /healthz, video, quiz, and spin wheel work as expected |

**Findings and corrections:**
- Make sure Docker Desktop is running ("Engine running") before running any Docker command.
- CMD users: replace `cp .env.example .env` with `copy .env.example .env`.

## 15. Contributors

Ardi, Neyra, Ilmi, Therry, Fira