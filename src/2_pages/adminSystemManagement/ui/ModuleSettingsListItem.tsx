import {
  IRegulatorItemProps,
  IRenderHierarchyModalsProps,
  ModuleSettingsListItemProps,
} from '../model';
import { DashboardKpiSettings } from './regulatorEye/DashboardKpiSettings';
import { DashboardObjectsSettings } from './regulatorEye/DashboardObjectsSettings';
import { DashboardRoleSettings } from './regulatorEye/DashboardRoleSettings';
import { Hierarchies, HierarchyPreviewModal, KpiSettingsModal } from './dashboard';
import { TopViewHierarchies } from './dashboard/TopViewHierarchies';
import { GroupedSettings } from './GroupedSettings';

const renderRegulatorSettings = ({
  groupName,
  value,
  defaultModuleName,
  form,
  editModuleData,
  editRow,
  setEditRow,
  objects,
}: IRegulatorItemProps) => {
  switch (groupName) {
    case 'KPI Settings':
      return (
        <DashboardKpiSettings
          key={groupName}
          moduleSettings={{ module_name: defaultModuleName, settings: objects }}
          settings={value}
          settingsKey={groupName}
          defaultModuleName={defaultModuleName}
          form={form}
          editModuleData={editModuleData}
          editRow={editRow}
          setEditRow={setEditRow}
        />
      );
    case 'Objects Settings':
      return (
        <DashboardObjectsSettings
          key={groupName}
          defaultModuleName={defaultModuleName}
          groupName={groupName}
          form={form}
          strings={value}
          editModuleData={editModuleData}
        />
      );
    case 'Role Settings':
      return (
        <DashboardRoleSettings
          key={groupName}
          defaultModuleName={defaultModuleName}
          groupName={groupName}
          form={form}
          strings={value}
          editModuleData={editModuleData}
        />
      );
    default:
      return (
        <GroupedSettings
          key={groupName}
          defaultModuleName={defaultModuleName}
          groupName={groupName}
          form={form}
          strings={value}
          editModuleData={editModuleData}
          editRow={editRow}
          setEditRow={setEditRow}
        />
      );
  }
};

const renderHierarchyModals = ({
  openItemModal,
  objects,
  defaultModuleName,
  form,
  editDashboardKpiData,
  addExternalLevel,
  editRow,
  setEditRow,
  setModuleData,
  moduleData,
  hierarchies,
  setOpenItemModal,
}: IRenderHierarchyModalsProps) => {
  if (!openItemModal) return null;

  if (openItemModal.type === 'kpiSettings') {
    return (
      <KpiSettingsModal
        openItemModal={openItemModal}
        setOpenItemModal={setOpenItemModal}
        activeHierarchy={hierarchies?.items?.find((el) => el.id === +openItemModal.id) ?? null}
        key="KPI Settings"
        settings={objects['KPI Settings'][openItemModal?.id] ?? []}
        defaultModuleName={defaultModuleName}
        form={form}
        editDashboardKpiData={editDashboardKpiData}
        addExternalLevel={addExternalLevel}
        editRow={editRow}
        setEditRow={setEditRow}
        setModuleData={setModuleData}
        moduleData={moduleData}
      />
    );
  }

  if (openItemModal.type === 'preview') {
    return (
      <HierarchyPreviewModal
        openItemModal={openItemModal}
        setOpenItemModal={setOpenItemModal}
        permissions={{ view: true, update: false, administrate: false }}
        activeHierarchy={hierarchies?.items?.find((el) => el.id === +openItemModal.id) ?? null}
        settings={objects['KPI Settings'][openItemModal?.id]?.filter(
          (el: any) => el.external_level,
        )}
      />
    );
  }

  return null;
};

type IProps = ModuleSettingsListItemProps;

export const ModuleSettingsListItem = ({ ...props }: IProps) => {
  const {
    defaultModuleName,
    addExternalLevel,
    editDashboardKpiData,
    editModuleData,
    editRow,
    setEditRow,
    form,
    groupName,
    hierarchies,
    moduleData,
    setModuleData,
    openItemModal,
    setOpenItemModal,
    value,
    objects,
  } = props;

  if (defaultModuleName === 'Regulator Eye' || defaultModuleName === 'Dashboard Pres') {
    return renderRegulatorSettings({
      defaultModuleName,
      editModuleData,
      form,
      value,
      groupName,
      editRow,
      setEditRow,
      objects,
    });
  }

  if (defaultModuleName === 'Dashboard') {
    switch (groupName) {
      case 'Hierarchies':
        return (
          <>
            <Hierarchies
              key={groupName}
              defaultModuleName={defaultModuleName}
              groupName={groupName}
              form={form}
              currentHierarchies={value}
              editModuleData={editModuleData}
              setOpenItemModal={setOpenItemModal}
            />
            {renderHierarchyModals({
              openItemModal,
              objects,
              defaultModuleName,
              form,
              editDashboardKpiData,
              addExternalLevel,
              editRow,
              setEditRow,
              setModuleData,
              moduleData,
              hierarchies,
              setOpenItemModal,
            })}
          </>
        );

      case 'KPI Settings':
        return null;
      default:
        break;
    }
  }

  if (defaultModuleName === 'Top View Dashboard') {
    switch (groupName) {
      case 'Hierarchies':
        return (
          <>
            <TopViewHierarchies
              key={groupName}
              defaultModuleName={defaultModuleName}
              groupName={groupName}
              form={form}
              currentHierarchies={value}
              editModuleData={editModuleData}
              setOpenItemModal={setOpenItemModal}
            />
            {renderHierarchyModals({
              openItemModal,
              objects,
              defaultModuleName,
              form,
              editDashboardKpiData,
              addExternalLevel,
              editRow,
              setEditRow,
              setModuleData,
              moduleData,
              hierarchies,
              setOpenItemModal,
            })}
          </>
        );

      case 'KPI Settings':
        return null;

      default:
        break;
    }
  }

  return (
    <GroupedSettings
      key={groupName}
      defaultModuleName={defaultModuleName}
      groupName={groupName}
      form={form}
      strings={value}
      editModuleData={editModuleData}
      editRow={editRow}
      setEditRow={setEditRow}
    />
  );
};
