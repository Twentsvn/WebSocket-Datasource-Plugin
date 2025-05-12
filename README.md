#  Pulkit-Plugin @ Godspeed

The **Pulkit-Plugin** is a simple WebSocket client that connects to a specified server, collects data for a given duration, and stores it in a file. Built to work within the **_Godspeed Framework_** this plugin requires minimal setup .

---

##  Configuration

All settings for the plugin are managed through the `pulkit-plugin.yaml` file. The following parameters can be configured:

| Parameter   | Description                                                |
|-------------|------------------------------------------------------------|
| `duration`  | Time (milli-seconds) to collect data from the WebSocket.     |
| `username`  | Currently "admin" is the only right choice :)              |
| `password`  | Currently "admin" is the only right choice :)               |
| `url`       | WebSocket URL to connect to (no authentication required). |

---

##  How to Run

Follow these steps to run the **_Pulkit-Plugin_** inside your Godspeed project:

> For godspeed
```bash
npm install -g @godspeedsystems/godspeed
```

1. **Navigate to your Godspeed project directory:**
   ```bash
   godspeed create /path/to/your/godspeed/project
   ```
   ```bash
   cd /path/to/your/godspeed/project
   ```
2. **Replace the existing src directory with the plugin:**
   ```bash
   rm -rf /path/to/your/godspeed/project/src
   mv ./src /path/to/your/godspeed/project
   ```
3. **Build the project**
    ```bash
    godspeed build
    ```
4. **Start the development server**
    ```bash
    godspeed dev
    ```
5. **Access the WebSocket**
    > After starting the server, check the terminal output.  
    > A WebSocket URL will be displayed.

---
## Output
* __Data received from the WebSocket is saved to a /path/to/godspeed/project/log .__  

* __The exact file name will be shown in the Goodspeed CLI .__

---
## Note

* __No authentication is required to connect to the WebSocket.__

* __The username and password fields are currently unused but reserved for future support.__
