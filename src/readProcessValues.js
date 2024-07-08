module.exports = function (RED) {
    function readProcessValues(config) {
        RED.nodes.createNode(this, config);
        this.selector = config.selector;
        this.globalContext = this.context().global;
        var node = this;

        async function setPlcActiveFlagsOnce() {
            // has the PlcActive flag already been set by any node?
            const globalContextPlcActiveIsSet = 'jumo-varitron-process-values-plc-active-flag-set';
            if (node.globalContext.get(globalContextPlcActiveIsSet) !== true) {
                try {
                    const { setPlcActiveFlags } = await import('@jumo.net/varitron-process-values');
                    await setPlcActiveFlags();
                    node.globalContext.set(globalContextPlcActiveIsSet, true);
                } catch (e) {
                    throw new Error(`Not able to set PlcActive flag: ${e}`);
                }
            }
        }

        async function readValue(selector) {
            const { read } = await import('@jumo.net/varitron-process-values');

            // if the selector pointing to the EtherCatGateway, the PlcActive flag should be set
            // to allow access to the process values of the controller module
            if (selector.includes('EtherCatGateway')) {
                await setPlcActiveFlagsOnce();
            }

            // read the process value
            const value = await read(selector);
            return value;
        }

        // Start fetching data when the node is deployed
        node.on('input', async function (msg, send, done) {
            try {
                // Read value using either the selector from the node config or from the msg
                const selector = node.selector || msg.selector;
                if (!selector) {
                    throw new Error('No selector provided');
                }
                msg.payload = await readValue(selector);
                msg.selector = selector;
                node.send(msg);
                done();
            } catch (e) {
                done(e);
            }
        });

        // Handle node cleanup
        node.on('close', function () {
        });
    }
    RED.nodes.registerType('read process values', readProcessValues);
}
