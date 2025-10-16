import config from 'config';
import type {
  IContextMenuData,
  IMapStyleModel,
  MapBoxMapContextMenuType,
  MapBoxObjectContextMenuType,
  MapBoxPolygonContextMenuType,
} from './types';

export const MAP_INITIAL_STATE = {
  latitude: +config._map_initial_latitude,
  longitude: +config._map_initial_longitude,
  zoom: 12,
  minZoom: 5,
  maxZoom: 18,
};

const MAP_BOX_STYLE_BASE_URL = 'mapbox://styles/mapbox/';
const MAP_BOX_STYLE_3D_BASE_URL = 'mapbox://styles/sofia-budaeva/';
export const mapStyles: IMapStyleModel = {
  '2d': [
    {
      label: 'Default',
      style: {
        dark: `${MAP_BOX_STYLE_BASE_URL}dark-v10`,
        light: `${MAP_BOX_STYLE_BASE_URL}light-v10`,
      },
    },
    {
      label: 'Streets',
      style: { light: `${MAP_BOX_STYLE_BASE_URL}streets-v12` },
    },
    {
      label: 'Satellite',
      style: { light: `${MAP_BOX_STYLE_BASE_URL}satellite-v9` },
    },
    {
      label: 'Hybrid',
      style: { light: `${MAP_BOX_STYLE_BASE_URL}satellite-streets-v12` },
    },
    {
      label: 'Navigation',
      style: {
        light: `${MAP_BOX_STYLE_BASE_URL}navigation-day-v1`,
        dark: `${MAP_BOX_STYLE_BASE_URL}navigation-night-v1`,
      },
    },
  ],
  '3d': [
    {
      label: 'Default',
      style: {
        dark: `${MAP_BOX_STYLE_3D_BASE_URL}clslx7os501qx01qsckaz15qb`,
        light: `${MAP_BOX_STYLE_3D_BASE_URL}clslxceo9025n01r43l9r1tyi`,
      },
    },
    {
      label: 'Streets',
      style: { light: `${MAP_BOX_STYLE_3D_BASE_URL}clslxep1701qy01qs3bvgdc24` },
    },
    {
      label: 'Navigation',
      style: {
        light: `${MAP_BOX_STYLE_3D_BASE_URL}clslxi10901d001qlcuro2y9t`,
        dark: `${MAP_BOX_STYLE_3D_BASE_URL}clslxjbzz01d201qla1gx0741`,
      },
    },
  ],
};

export const OBJECT_CONTEXT_MENU_OPTIONS: IContextMenuData<MapBoxObjectContextMenuType>[] = [
  { id: 'edit', label: 'Edit', value: 'edit', rule: 'update' },
  { id: 'details', label: 'Details', value: 'details', rule: ['details', 'view'] },
  // { label: 'Run reports', value: 'runReports' },
  {
    id: 'viewDiagram',
    label: 'View diagram',
    value: 'viewDiagram',
    disabled: true,
    rule: ['diagrams', 'view'],
  },
  { id: 'viewFiles', label: 'View files', value: 'viewFiles', rule: 'view' },
  { id: 'viewTable', label: 'View table', value: 'viewTable', rule: ['inventory', 'view'] },
  { id: 'findPath', label: 'Find a path', value: 'findPath', rule: ['view'] },
  { id: 'createChild', label: 'Create child', value: 'createChild', rule: ['inventory', 'update'] },
  { id: 'delete', label: 'Delete', value: 'delete', rule: ['inventory', 'update'] },
];

export const POLYGON_CONTEXT_MENU_OPTIONS: IContextMenuData<MapBoxPolygonContextMenuType>[] = [
  // { label: 'Edit', value: 'edit' },
  // { label: 'Run reports', value: 'runReports' },
  {
    id: 'viewDiagram',
    label: 'View diagram',
    disabled: true,
    value: 'viewDiagram',
    rule: ['diagrams', 'view'],
  },
  {
    id: 'exportData',
    label: 'Export data',
    value: 'exportData',
    submenu: [
      { id: 'toKml', label: 'To kml', value: 'toKml' },
      { id: 'toTab', label: 'To tab', value: 'toTab' },
      { id: 'toExcel', label: 'To excel', value: 'toExcel' },
    ],
    rule: 'view',
  },
];

export const MAP_CONTEXT_MENU_OPTIONS: IContextMenuData<MapBoxMapContextMenuType>[] = [
  { id: 'newObject', label: 'New object', value: 'newObject', rule: 'update' },
  {
    id: 'exportData',
    label: 'Export data',
    value: 'exportData',
    submenu: [
      { id: 'toKml', label: 'To kml', value: 'toKml' },
      { id: 'toTab', label: 'To tab', value: 'toTab' },
      { id: 'toExcel', label: 'To excel', value: 'toExcel' },
      { id: 'toJpeg', label: 'To jpeg', value: 'toJpeg' },
      { id: 'toPng', label: 'To png', value: 'toPng' },
    ],
    rule: 'view',
  },
];

export const STREET_VIEW_MAP_ID = 'street-view-map-id';
