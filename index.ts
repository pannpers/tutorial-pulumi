import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';


// Create a newwork
const network = new gcp.compute.Network('network')
const computeFirewall = new gcp.compute.Firewall('firewall', {
  network: network.id,
  allows: [{
    protocol: 'tcp',
    ports: [ '22' ],
  }],
})


// Create a Virtual Machine Instance
const computeInstance = new gcp.compute.Instance('instance', {
  machineType: 'f1-micro',
  zone: 'us-central1-z',
  bootDisk: { initializeParams: { image: 'debian-cloud/debian-9' } },
  networkInterfaces: [{
    network: network.id,
    // accessConfigs must include a single empty config to request an ephemeral IP.
    accessConfigs: [{}],
  }],
})

// Export the name and IP address of the Instance
exports.instanceName = computeInstance.name
exports.instanceIP = computeInstance.networkInterfaces
  .apply(ni => ni[0].accessConfigs && ni[0].accessConfigs[0].natIp)
