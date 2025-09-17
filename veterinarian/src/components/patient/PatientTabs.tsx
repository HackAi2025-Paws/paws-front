interface PatientTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function PatientTabs({ activeTab, onTabChange }: PatientTabsProps) {
  const tabs = [
    { id: 'historia', label: 'Historia Clínica' },
    { id: 'vacunas', label: 'Vacunas' },
    { id: 'agregar', label: 'Agregar Datos' }
  ]

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}