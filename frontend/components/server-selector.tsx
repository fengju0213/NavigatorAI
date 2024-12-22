"use client"

interface StageConfig {
  label: string
  value: string
  server: string
  description: string
}

interface StageSelectorProps {
  currentServer: string
  onServerChange: (server: string) => void
}

export function StageSelector({ currentServer, onServerChange }: StageSelectorProps) {
  const stages: StageConfig[] = [
    { 
      label: 'Stage 1', 
      value: 'http://localhost:5000',
      server: '5000',
      description: '基础对话阶段'
    },
    { 
      label: 'Stage 2', 
      value: 'http://localhost:6000',
      server: '6000',
      description: '工具调用阶段'
    },
    { 
      label: 'Stage 3', 
      value: 'http://localhost:7000',
      server: '7000',
      description: '多模态阶段'
    },
  ]

  const currentStage = stages.find(stage => stage.value === currentServer) || stages[0]

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          当前阶段:
        </span>
        <select
          value={currentServer}
          onChange={(e) => onServerChange(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {stages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {currentStage.description}
      </span>
    </div>
  )
} 