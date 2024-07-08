module.exports = function (RED) {
    function browseProcessValues(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        async function browse() {
            const { getList } = await import('@jumo.net/varitron-process-values');
            const providerList = await getList();
            return providerList;
        }

        node.on('input', async function (msg, send, done) {
            try {
                this.status({ fill: 'blue', shape: 'dot', text: '' });
                msg.payload = await browse();
                node.send(msg);
            } catch (e) {
                done(e);
            }

            this.status({});
            done();
        });

        node.on('close', function () {
        });
    }
    RED.nodes.registerType('browse process values', browseProcessValues);

    RED.httpAdmin.get('/process-value-description', RED.auth.needsPermission('browse process values.read'), async function (req, res) {
        // recursive search all URLs in the object
        function searchProcessValues(obj, processValueList) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        searchProcessValues(obj[key], processValueList);
                    } else {
                        if (key === 'selector') {
                            //'name': 'AnalogValues046',
                            //'selector': 'ProcessData#SpsConfigurationManager#ConfigurationProcessData#SharedMemory#AnalogValues046',
                            const urlParts = obj[key].split('#');

                            // if category is equal to subcategory or subcategory is 'SharedMemory', then only show category
                            function getCleanCategory(category, subcategory) {
                                if (category.toLowerCase() == subcategory.toLowerCase() || subcategory.toLowerCase() == 'sharedmemory') {
                                    return category;
                                }
                                return `${category}/${subcategory}`;
                            }

                            const category = (urlParts.length < 5) ? obj[key] : getCleanCategory(urlParts[1], urlParts[3]);
                            const name = urlParts[4];

                            processValueList.push({
                                label: name,
                                category,
                                selector: obj[key]
                            });
                        }
                    }
                }
            }
            return processValueList;
        }

        const { getList } = await import('@jumo.net/varitron-process-values');
        try {
            const processUrlList = await getList();
            const out = searchProcessValues(processUrlList, []);
            res.json(out);
        } catch (e) {
            res.json([]);
            throw e;
        }
    });
}
