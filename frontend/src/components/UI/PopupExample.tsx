import React, { useState } from 'react'
import { Trash2, Edit, Save, Info } from 'lucide-react'
import { 
  Modal, 
  Alert, 
  Tooltip, 
  LoadingModal, 
  ConfirmDialog,
  useModal, 
  useAlert, 
  useConfirm, 
  useLoading,
  useNotifications 
} from './index'

const PopupExample: React.FC = () => {
  const { modalState, openModal, closeModal } = useModal()
  const { alertState, showSuccess, showError, closeAlert } = useAlert()
  const { confirmState, confirmDelete, closeConfirm } = useConfirm()
  const { loadingState, showLoading, hideLoading } = useLoading()
  const { showSuccess: notifySuccess, showInfo: notifyInfo } = useNotifications()

  const [items] = useState([
    { id: 1, name: 'Plastic Bottle', category: 'Recyclable' },
    { id: 2, name: 'Food Waste', category: 'Organic' },
    { id: 3, name: 'Paper Document', category: 'Recyclable' }
  ])

  const handleDeleteItem = (item: typeof items[0]) => {
    confirmDelete(item.name, async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      notifySuccess('Item deleted', `${item.name} has been removed from your waste log`)
    })
  }

  const handleEditItem = (item: typeof items[0]) => {
    openModal({
      title: `Edit ${item.name}`,
      size: 'md',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
            <input 
              type="text" 
              className="input-field" 
              defaultValue={item.name}
              placeholder="Enter item name" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select className="input-field" defaultValue={item.category}>
              <option value="Recyclable">Recyclable</option>
              <option value="Organic">Organic</option>
              <option value="Hazardous">Hazardous</option>
              <option value="General">General Waste</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={() => {
                closeModal()
                showLoading({ message: 'Saving changes...' })
                setTimeout(() => {
                  hideLoading()
                  notifySuccess('Changes saved', 'Item has been updated successfully')
                }, 2000)
              }}
            >
              <Save size={16} />
              Save Changes
            </button>
            <button 
              className="btn-secondary flex-1" 
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )
    })
  }

  const handleBulkAction = () => {
    showSuccess(
      'Bulk Action Complete',
      'All selected items have been processed successfully.',
      () => {
        notifyInfo('Next Steps', 'You can now view the updated waste report in your dashboard.')
      }
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text mb-2">EcoCircle Popup System</h1>
        <p className="text-slate-600">Modern, accessible popups integrated with your waste management workflow</p>
      </div>

      {/* Waste Items List */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Your Waste Items</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-600">{item.category}</p>
              </div>
              <div className="flex gap-2">
                <Tooltip content="Edit this item" position="top">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="p-2 text-slate-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                </Tooltip>
                
                <Tooltip content="Delete this item" position="top">
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleBulkAction}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Info size={16} />
          Process All Items
        </button>

        <button
          onClick={() => {
            showLoading({ message: 'Generating report...', showProgress: true, progress: 0 })
            let progress = 0
            const interval = setInterval(() => {
              progress += 20
              if (progress <= 100) {
                // Update progress logic would go here
              }
              if (progress >= 100) {
                clearInterval(interval)
                setTimeout(() => {
                  hideLoading()
                  notifySuccess('Report generated', 'Your waste management report is ready for download')
                }, 500)
              }
            }, 400)
          }}
          className="btn-secondary"
        >
          Generate Report
        </button>

        <button
          onClick={() => {
            showError(
              'Feature Coming Soon',
              'Advanced analytics will be available in the next update. Stay tuned!',
              () => notifyInfo('Thanks for your interest!')
            )
          }}
          className="btn-secondary"
        >
          View Analytics
        </button>
      </div>

      {/* Render Popups */}
      <Modal {...modalState} onClose={closeModal}>
        {modalState.content}
      </Modal>
      <Alert {...alertState} onClose={closeAlert} />
      <ConfirmDialog {...confirmState} onClose={closeConfirm} onConfirm={confirmState.onConfirm || (() => {})} />
      <LoadingModal {...loadingState} />
    </div>
  )
}

export default PopupExample
