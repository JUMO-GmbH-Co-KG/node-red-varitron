module.exports = function (RED) {
    function writeProcessValues(config) {
        RED.nodes.createNode(this, config);
        this.selector = config.selector;
        this.processvalue = config.processvalue;
        this.processvaluefieldtype = config.processvaluefieldtype;
        this.globalContext = this.context().global;
        var node = this;

        async function setPlcActiveFlagsOnce() {
            // has the PlcActive flag already been set by any node?
            const globalContextPlcActiveIsSet = 'jumo-varitron-process-values-plc-active-flag-set';
            if (node.globalContext.get(globalContextPlcActiveIsSet) !== true) {
                try {
                    const { setPlcActiveFlags } = await import('@jumo.net/varitron-process-values');
                    await setPlcActiveFlags();
                } catch (e) {
                    throw new Error(`Not able to set PlcActive flag: ${e}`);
                }
            }
        }

        async function writeSingleValue(msg, selector, value) {
            const { write } = await import('@jumo.net/varitron-process-values');

            if (!selector) {
                throw new Error('No selector provided');
            }

            // if the selector pointing to the EtherCatGateway, the PlcActive flag should be set
            // to allow access to the process values of the controller module
            if (selector.includes('EtherCatGateway')) {
                await setPlcActiveFlagsOnce();
            }

            try {
                const selectorValuePair = {
                    selector: selector || '',
                    value,
                }
                const result = await write(selectorValuePair);
                msg.payload = {
                    done: result.done,
                    message: 'success',
                };
            } catch (e) {
                msg.payload = {
                    done: false,
                    message: e.message || e,
                };
            }
            msg.selector = selector;
            node.send(msg);
        }

        async function writeValueList(msg, valueList) {
            const { write } = await import('@jumo.net/varitron-process-values');

            try {
                // if one of the selectors in the valueList is pointing to the EtherCatGateway,
                // the PlcActive flag should be set to allow access to the process values of
                // the controller module
                if (valueList.find(item => item.selector.includes('EtherCatGateway'))) {
                    await setPlcActiveFlagsOnce();
                }

                const result = await write(valueList);

                // merge valueList and result
                result.forEach((item, index) => {
                    item.selector = valueList[index].selector;
                    item.message = 'success';
                });
                msg.payload = result;
                node.send(msg);
            } catch (e) {
                throw new Error('Error writing array of process values: ' + e);
            }
        }

        node.on('input', async function (msg, send, done) {
            try {
                // parse value from node config
                const processValue = RED.util.evaluateNodeProperty(node.processvalue, node.processvaluefieldtype, node, msg);

                // write either with selector and payload from node config or from msg
                const validProcessValue = (processValue == undefined) ? msg.payload : processValue;

                // switch beteween writing a sigle value or an array of values
                if (Array.isArray(validProcessValue)) {
                    await writeValueList(msg, validProcessValue);
                } else {
                    await writeSingleValue(msg, node.selector || msg.selector, validProcessValue);
                }
                done();
            } catch (e) {
                done(e);
            }
        });

        node.on('close', function () {
        });
    }
    RED.nodes.registerType('write process values', writeProcessValues);
}
