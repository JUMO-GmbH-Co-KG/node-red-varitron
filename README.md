# Node-RED node collection for JUMO variTRON

This Node-RED node collection is designed to integrate seamlessly with the JUMO variTRON system, allowing users to browse selectors, read process values and write values. The collection includes three nodes, each serving a specific purpose within the JUMO variTRON ecosystem.

## Compatibility

**Note:** This node collection is only compatible with JUMO variTRON firmware versions x.8.2.0.0 or greater.

## Nodes Overview

### 1. Browse Node

- **Node Name:** browse process values
- **Purpose:** Provides an overview of all selectors within the variTRON system.
- **Usage:**
  - Use this node during the creation of a new Node-RED project or when searching for a specific selector.
  - Outputs a list of all available selectors for reference.

### 2. Read Node

- **Node Name:** read process values
- **Purpose:** Reads process values using a specified selector.
- **Usage:**
  - Set the selector in the node configuration for a static value or inject it dynamically using `msg.selector`.
  - Outputs the requested value along with properties and error code of the process value.

### 3. Write Node

- **Node Name:** write process values
- **Purpose:** Writes a value to a specified selector.
- **Usage:**
  - Set the selector in the node configuration for a static value or inject it dynamically using `msg.selector`.
  - Inject the new value using `msg.payload` or set it in the node configuration.
  - Provides flexibility in updating process values within the JUMO variTRON system.

## Installation

1. Open your Node-RED instance.
2. Navigate to the "Manage Palette" option.
3. Go to the "Install" tab.
4. Search for "@jumo.net/node-red-varitron" and click "Install."

## Configuration

For each node, configure the necessary parameters such as selector, and additional settings in the node configuration panel.

## Example Flow

```json
[{"id":"65366e56.d72ed","type":"inject","z":"341ad3ff.cbff9c","name":"inject","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":110,"y":120,"wires":[["13a86df4.594992"]]},{"id":"2fd22efe.cda582","type":"debug","z":"341ad3ff.cbff9c","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":810,"y":120,"wires":[]},{"id":"b3a9ddf2.e7c66","type":"inject","z":"341ad3ff.cbff9c","name":"CPU temp","props":[{"p":"selector","v":"ProcessData#SystemObserver#ProcessData#SystemObserver#Temperature/CpuInternal/CurrentValue","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":120,"y":260,"wires":[["f0c76bcc.5d3548"]]},{"id":"fb8982cf.e8f62","type":"debug","z":"341ad3ff.cbff9c","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":810,"y":260,"wires":[]},{"id":"6187c853.eddeb8","type":"inject","z":"341ad3ff.cbff9c","name":"MemoryAlarm -> true","props":[{"p":"payload"},{"p":"selector","v":"ProcessData#DataBaseManagement#ProcessData#DatabaseManagement#MemoryAlarm","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":160,"y":460,"wires":[["bedcf0bb.a8312"]]},{"id":"ef5792ea.c3d34","type":"debug","z":"341ad3ff.cbff9c","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":810,"y":460,"wires":[]},{"id":"549f318.2e93fd","type":"change","z":"341ad3ff.cbff9c","name":"payload.value","rules":[{"t":"set","p":"payload","pt":"msg","to":"payload.value","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":620,"y":260,"wires":[["fb8982cf.e8f62"]]},{"id":"13a86df4.594992","type":"browse process values","z":"341ad3ff.cbff9c","name":"","x":400,"y":120,"wires":[["2fd22efe.cda582"]]},{"id":"f0c76bcc.5d3548","type":"read process values","z":"341ad3ff.cbff9c","name":"","x":400,"y":260,"wires":[["549f318.2e93fd"]]},{"id":"bedcf0bb.a8312","type":"write process values","z":"341ad3ff.cbff9c","name":"","processvalue":"payload","processvaluefieldtype":"msg","x":400,"y":460,"wires":[["ef5792ea.c3d34"]]},{"id":"6e8f8e41.b9d49","type":"inject","z":"341ad3ff.cbff9c","name":"MemoryAlarm","props":[{"p":"selector","v":"ProcessData#DataBaseManagement#ProcessData#DatabaseManagement#MemoryAlarm","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":130,"y":320,"wires":[["f0c76bcc.5d3548"]]},{"id":"d15c2002.4d117","type":"comment","z":"341ad3ff.cbff9c","name":"List all available process values","info":"","x":170,"y":60,"wires":[]},{"id":"cc8e16e6.ef40d8","type":"inject","z":"341ad3ff.cbff9c","name":"MemoryAlarm -> false","props":[{"p":"payload"},{"p":"selector","v":"ProcessData#DataBaseManagement#ProcessData#DatabaseManagement#MemoryAlarm","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"false","payloadType":"bool","x":160,"y":520,"wires":[["bedcf0bb.a8312"]]},{"id":"c89deafa.c2f568","type":"comment","z":"341ad3ff.cbff9c","name":"Read CPU temperature or memory alarm","info":"Reads either the CPU temperature or the memory alarm. Only the value is cut out of the result. All other data such as unit or name will be removed.","x":200,"y":200,"wires":[]},{"id":"bb513c6e.55d0f","type":"comment","z":"341ad3ff.cbff9c","name":"Set the value of memory alarm to true/false","info":"","x":200,"y":400,"wires":[]}]
```

Feel free to adapt and customize this Node-RED flow according to your specific use case.

## Issues and Contributions
If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/JUMO-GmbH-Co-KG).

Happy coding with JUMO variTRON and Node-RED!