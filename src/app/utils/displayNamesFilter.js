const displayNames = {
  // State Titles
  'dashboard': 'Dashboard',
  'entity': 'Entity Investigation',
  'rule-engine': 'Micro Analytics Manager',
  'graph': 'Threat Linking',
  'raw-data': 'Event Data',
  // Threat Related
  'timestamp': 'Timestamp',
  'entityId': 'Alerted Entities',
  'threatScenario': 'Threat Scenario',
  'ThreatPhase': 'Threat Phase',
  'dataSource': 'Data Source',
  'analyticsType': 'Analytics Type',
  'analyticsID': 'Analytics ID',
  'analyticsDetails': 'Analytics Details',
  'features': 'Feature',
  'BadClient-RGDNForbiddenBigramsCallsNXDOMAIN': 'Forbidden Bigrams Calls',
  'BadClient-SrcipQueryingLargeSetOfResolvingLongDomainNames': 'Large Set of Resolving Long Domain Names',
  'Abnormal Network Connections': "Abnormal Network Conn",
  'Minority Report': 'Peer Based Anomalous Behaviour',
  'Temporal Minority Report': 'Historical Anomalous Behaviour',
  // Features
  'numEvents_DNS': 'Total DNS Requests',
  'numRes_DNS': 'Resolving DNS Requests',
  'maxLenDN_DNS': 'Length of Requested Domains',
  'ttl_DNS': 'DNS TTL',
  'numNXDOMAIN_DNS': 'Non-resolving DNS Requests',
  'numPorts_WP': 'HTTP Ports',
  'numActionObserved_WP': 'Web Proxy Actions',
  'numProxyEvents_WP': 'Total HTTP traffic',
  // Raw Data
  // Web proxy
  'requestURLFilename': 'Requested File',
  'referer': 'URL',
  'requestURLAuthority': 'Authority',
  'requestMethod': 'Method',
  'requestProtocol': 'Protocol',
  'requestClient': 'Client Used',
  // DNS
  'request': 'Requested Domain',
  'cs4': 'Resolving IP address',
  'cn4': 'TTL',
  'cat': 'Response Type',
  'isDGA': 'DGA'
};

const displayNamesFilter = () => (input, options) => {
  if (options && options[input]) {
    return options[input];
  }
  return displayNames[input] ? displayNames[input] : input;
};

export default displayNamesFilter;
