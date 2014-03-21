module.exports = {
  xmp: {
    'Creator Email'     : { 'regexp': '<Iptc4xmpCore:CreatorContactInfo[^>]+?CiEmailWork="([^"]*)"', 'match': 1, 'split': '' },
    'Owner Name'        : { 'regexp': '<rdf:Description[^>]+?aux:OwnerName="([^"]*)"', 'match': 1, 'split': '' },
    'Creation Date'     : { 'regexp': '<rdf:Description[^>]+?xmp:CreateDate="([^"]*)"', 'match': 1, 'split': '' },
    'Modification Date' : { 'regexp': '<rdf:Description[^>]+?xmp:ModifyDate="([^"]*)"', 'match': 1, 'split': '' },
    'Label'             : { 'regexp': '<rdf:Description[^>]+?xmp:Label="([^"]*)"', 'match': 1, 'split': '' },
    'Credit'            : { 'regexp': '<rdf:Description[^>]+?photoshop:Credit="([^"]*)"', 'match': 1, 'split': '' },
    'Source'            : { 'regexp': '<rdf:Description[^>]+?photoshop:Source="([^"]*)"', 'match': 1, 'split': '' },
    'Headline'          : { 'regexp': '<rdf:Description[^>]+?photoshop:Headline="([^"]*)"', 'match': 1, 'split': '' },
    'City'              : { 'regexp': '<rdf:Description[^>]+?photoshop:City="([^"]*)"', 'match': 1, 'split': '' },
    'State'             : { 'regexp': '<rdf:Description[^>]+?photoshop:State="([^"]*)"', 'match': 1, 'split': '' },
    'Country'           : { 'regexp': '<rdf:Description[^>]+?photoshop:Country="([^"]*)"', 'match': 1, 'split': '' },
    'Country Code'      : { 'regexp': '<rdf:Description[^>]+?Iptc4xmpCore:CountryCode="([^"]*)"', 'match': 1, 'split': '' },
    'Location'          : { 'regexp': '<rdf:Description[^>]+?Iptc4xmpCore:Location="([^"]*)"', 'match': 1, 'split': '' },
    'Title'             : { 'regexp': '<dc:title>\\s*<rdf:Alt>\\s*(.*?)\\s*<\/rdf:Alt>\\s*<\/dc:title>', 'match': 1, 'split': '' },
    'Description'       : { 'regexp': '<dc:description>\\s*<rdf:Alt>\\s*<rdf:li(.+?)>(.*?)</rdf:li>\\s*<\/rdf:Alt>\\s*<\/dc:description>', 'match': 2, 'split': '' },
    'Creator'           : { 'regexp': '<dc:creator>\\s*<rdf:Seq>\\s*<rdf:li>(.*?)</rdf:li>\\s*<\/rdf:Seq>\\s*<\/dc:creator>', 'match': 1, 'split': '' },
    'Keywords'          : { 'regexp': '<dc:subject>\\s*<rdf:Bag>\\s*<rdf:li>(.*?)</rdf:li>\\s*<\/rdf:Bag>\\s*<\/dc:subject>', 'match': 1, 'split': '</rdf:li><rdf:li>' },
  }
};
