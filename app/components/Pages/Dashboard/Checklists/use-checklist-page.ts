import { useEffect, useState } from 'react'

import {
  addBrandCheckListTask,
  getBrandChecklists,
  removeBrandChecklistTask,
  updateBrandChecklist,
  updateBrandChecklistTask,
  sortTasks,
  addBrandChecklistRole,
  removeBrandChecklistRole,
  sortRoles,
  updateBrandChecklistRole
} from 'models/BrandConsole/Checklists'

/**
 * react hook encapsulating logic related to checklists page
 */
export function useChecklistsPage(rootBrandId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [checklists, setChecklists] = useState<IBrandChecklist[]>([])

  const fetchChecklists = async (brandId: UUID) => {
    setLoading(true)

    try {
      setChecklists(await getBrandChecklists(brandId))
    } catch (e) {
      setError(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (rootBrandId) {
      fetchChecklists(rootBrandId)
    }
  }, [rootBrandId])

  const applyChecklistUpdate = (
    checklistId: string,
    update: IBrandChecklist | ((checklist: IBrandChecklist) => IBrandChecklist)
  ) => {
    setChecklists(checklists =>
      checklists.map(checklist => {
        if (checklist.id === checklistId) {
          return typeof update === 'function' ? update(checklist) : update
        }

        return checklist
      })
    )
  }

  const addTask = async (
    checklist: IBrandChecklist,
    taskData: IBrandChecklistTaskInput
  ) => {
    if (rootBrandId) {
      applyChecklistUpdate(
        checklist.id,
        await addBrandCheckListTask(rootBrandId, checklist.id, {
          title: '',
          ...taskData,
          order:
            Array.isArray(checklist.tasks) && checklist.tasks.length > 0
              ? Math.max(...checklist.tasks.map(task => task.order)) + 1
              : 1
        })
      )
    }
  }

  const addRole = async (checklist: IBrandChecklist, role: IDealRole) => {
    if (rootBrandId) {
      applyChecklistUpdate(
        checklist.id,
        await addBrandChecklistRole(rootBrandId, checklist.id, {
          ...role,
          order:
            Array.isArray(checklist.roles) && checklist.roles.length > 0
              ? Math.max(...checklist.roles.map(task => task.order)) + 1
              : 1
        })
      )
    }
  }

  const updateRole = async (
    checklist: IBrandChecklist,
    role: IBrandChecklistRole
  ) => {
    if (rootBrandId) {
      const checklist1 = await updateBrandChecklistRole(
        rootBrandId,
        checklist.id,
        role
      )

      applyChecklistUpdate(checklist.id, checklist1)
    }
  }

  const updateChecklist = async (checklist: IBrandChecklist) => {
    applyChecklistUpdate(checklist.id, await updateBrandChecklist(checklist))
  }

  const addChecklists = (list: IBrandChecklist[]) => {
    setChecklists([...checklists, ...list])
  }

  const addGenericTask = (checklist: IBrandChecklist) => {
    return addTask(checklist, {
      task_type: 'Generic'
    })
  }
  const addGeneralCommentTask = (checklist: IBrandChecklist) => {
    return addTask(checklist, {
      task_type: 'GeneralComments'
    })
  }
  const addSplitterTask = (checklist: IBrandChecklist) => {
    return addTask(checklist, {
      task_type: 'Splitter'
    })
  }
  const addFormTask = (checklist: IBrandChecklist, form: IBrandForm) => {
    return addTask(checklist, {
      task_type: 'Form',
      title: form.name,
      form: form.id
    })
  }
  const updateTask = async (task: IBrandChecklistTask) => {
    if (rootBrandId) {
      const checklist = await updateBrandChecklistTask(rootBrandId, task)

      applyChecklistUpdate(task.checklist, checklist)
    }
  }

  const deleteTask = async (checklistId: UUID, taskId: UUID) => {
    if (rootBrandId) {
      await removeBrandChecklistTask(rootBrandId, checklistId, taskId)
      applyChecklistUpdate(checklistId, checklist => ({
        ...checklist,
        tasks: (checklist.tasks || []).filter(task => task.id !== taskId)
      }))
    }
  }

  const deleteRole = async (checklistId: UUID, roleId: UUID) => {
    if (rootBrandId) {
      await removeBrandChecklistRole(rootBrandId, checklistId, roleId)
      applyChecklistUpdate(checklistId, checklist => ({
        ...checklist,
        roles: (checklist.roles || []).filter(role => role.id !== roleId)
      }))
    }
  }

  const reorderTasks = (checklistId: UUID, tasks: IBrandChecklistTask[]) => {
    if (rootBrandId) {
      const orders = tasks.map(task => ({
        id: task.id,
        order: task.order
      }))

      sortTasks(rootBrandId, checklistId, orders)

      // update related checklist with sorted tasks
      setChecklists(checklists =>
        checklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              tasks
            }
          }

          return checklist
        })
      )
    }
  }

  const reorderRoles = (checklistId: UUID, roles: IBrandChecklistRole[]) => {
    if (rootBrandId) {
      const orders = roles.map(role => ({
        id: role.id,
        order: role.order
      }))

      sortRoles(rootBrandId, checklistId, orders)

      setChecklists(checklists =>
        checklists.map(checklist => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              roles
            }
          }

          return checklist
        })
      )
    }
  }

  return {
    checklists,
    loading,
    error,
    addTask,
    addRole,
    updateChecklist,
    updateTask,
    updateRole,
    deleteTask,
    deleteRole,
    reorderTasks,
    reorderRoles,
    addChecklists,
    addGenericTask,
    addGeneralCommentTask,
    addSplitterTask,
    addFormTask,
    fetchChecklists
  }
}
