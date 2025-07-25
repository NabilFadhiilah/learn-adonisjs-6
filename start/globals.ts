import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as phIcons } from '@iconify-json/ph'
import Roles from '#enums/roles'

addCollection(phIcons)
edge.use(edgeIconify)

edge.global('globalExample', 'global info')
edge.global('Roles', Roles)
