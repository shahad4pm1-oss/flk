import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-50m.json','utf8'))
const fc = feature(topo, topo.objects.countries)
const ids = ['682','887','512','784','634','414','368','400','818','729','232','048','760','376','275','364','262','231']
const r = (c) => Array.isArray(c[0]) ? c.map(r) : [Math.round(c[0]*100)/100, Math.round(c[1]*100)/100]
const feats = fc.features.filter(f => ids.includes(String(f.id))).map(f => ({ type:'Feature', properties:{ id:String(f.id), ksa: String(f.id)==='682' }, geometry:{ type:f.geometry.type, coordinates: r(f.geometry.coordinates) } }))
console.log(feats.map(f=>f.properties.id).join(','))
writeFileSync('src/data/region.geo.json', JSON.stringify({type:'FeatureCollection',features:feats}))
