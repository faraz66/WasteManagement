import React from 'react'
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

const PopupDemo: React.FC = () => {
  const { modalState, openModal, closeModal } = useModal()
  const { alertState, showSuccess, showError, showWarning, showInfo, closeAlert } = useAlert()
  const { confirmState, confirmDelete, confirmSave, confirmLogout, closeConfirm } = useConfirm()
  const { loadingState, showLoading, hideLoading, updateProgress } = useLoading()
  const { showNotification, showSuccess: notifySuccess, showError: notifyError, showInfo: notifyInfo } = useNotifications()

  const handleProgressDemo = () => {
    showLoading({ message: 'Processing...', showProgress: true, progress: 0 })
    
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      updateProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          hideLoading()
          notifySuccess('Process completed successfully!')
        }, 500)
      }
    }, 200)
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">EcoCircle Popup Components</h1>
        <p className="text-slate-600">Modern, accessible popup components for your application</p>
      </div>

      {/* Modal Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Modal Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => openModal({
              title: 'Welcome to EcoCircle',
              size: 'md',
              content: (
                <div className="space-y-4">
                  <p className="text-slate-600">This is a beautiful modal with EcoCircle styling.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1">Get Started</button>
                    <button className="btn-secondary flex-1" onClick={closeModal}>Close</button>
                  </div>
                </div>
              )
            })}
            className="btn-primary"
          >
            Basic Modal
          </button>

          <button
            onClick={() => openModal({
              title: 'Large Content Modal',
              size: 'lg',
              content: (
                <div className="space-y-4">
                  <p className="text-slate-600">This modal demonstrates larger content areas.</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                      <li>Responsive design</li>
                      <li>Keyboard navigation</li>
                      <li>Focus management</li>
                      <li>Smooth animations</li>
                    </ul>
                  </div>
                </div>
              )
            })}
            className="btn-secondary"
          >
            Large Modal
          </button>

          <button
            onClick={() => openModal({
              title: 'Form Modal',
              size: 'md',
              content: (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input type="text" className="input-field" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" className="input-field" placeholder="Enter your email" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">Submit</button>
                    <button type="button" className="btn-secondary flex-1" onClick={closeModal}>Cancel</button>
                  </div>
                </form>
              )
            })}
            className="btn-secondary"
          >
            Form Modal
          </button>

          <button
            onClick={() => openModal({
              size: 'sm',
              content: (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-600">Processing your request...</p>
                  <button 
                    className="btn-secondary w-full"
                    onClick={() => {
                      closeModal()
                      notifySuccess('Process cancelled')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )
            })}
            className="btn-secondary"
          >
            Custom Modal
          </button>

          <button
            onClick={() => openModal({
              title: 'No Close Button',
              size: 'sm',
              content: (
                <div className="text-center space-y-4">
                  <p className="text-slate-600">This modal has no close button.</p>
                </div>
              )
            })}
            className="btn-secondary"
          >
            No Close Button
          </button>
        </div>
      </div>

      {/* Alert Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Alert Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => showSuccess('Success!', 'Your action was completed successfully.')}
            className="btn-primary"
          >
            Success Alert
          </button>

          <button
            onClick={() => showError('Error!', 'Something went wrong. Please try again.')}
            className="btn-secondary"
          >
            Error Alert
          </button>

          <button
            onClick={() => showWarning('Warning!', 'Please review your input before proceeding.')}
            className="btn-secondary"
          >
            Warning Alert
          </button>

          <button
            onClick={() => showInfo('Information', 'Here is some helpful information for you.')}
            className="btn-secondary"
          >
            Info Alert
          </button>
        </div>
      </div>

      {/* Confirmation Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Confirmation Dialogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => confirmDelete('Important Document', () => {
              return new Promise(resolve => {
                setTimeout(() => {
                  notifySuccess('Document deleted successfully')
                  resolve()
                }, 1500)
              })
            })}
            className="btn-primary"
          >
            Delete Confirmation
          </button>

          <button
            onClick={() => confirmSave(() => {
              return new Promise(resolve => {
                setTimeout(() => {
                  notifySuccess('Changes saved successfully')
                  resolve()
                }, 1000)
              })
            })}
            className="btn-secondary"
          >
            Save Confirmation
          </button>

          <button
            onClick={() => confirmLogout(() => {
              return new Promise(resolve => {
                setTimeout(() => {
                  notifyInfo('Logged out successfully')
                  resolve()
                }, 800)
              })
            })}
            className="btn-secondary"
          >
            Logout Confirmation
          </button>
        </div>
      </div>

      {/* Loading Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Loading Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              showLoading({ message: 'Loading data...' })
              setTimeout(() => {
                hideLoading()
                notifySuccess('Data loaded successfully')
              }, 2000)
            }}
            className="btn-primary"
          >
            Basic Loading
          </button>

          <button
            onClick={handleProgressDemo}
            className="btn-secondary"
          >
            Progress Loading
          </button>

          <button
            onClick={() => {
              showLoading({ message: 'Uploading files...', showProgress: true, progress: 45 })
              setTimeout(() => {
                hideLoading()
                notifySuccess('Upload completed')
              }, 3000)
            }}
            className="btn-secondary"
          >
            Upload Progress
          </button>
        </div>
      </div>

      {/* Notification Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Notification System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => notifySuccess('Success!', 'Operation completed successfully')}
            className="btn-primary"
          >
            Success Notification
          </button>

          <button
            onClick={() => notifyError('Error!', 'Something went wrong')}
            className="btn-secondary"
          >
            Error Notification
          </button>

          <button
            onClick={() => showNotification({
              type: 'info',
              title: 'New Feature Available',
              message: 'Check out our latest waste tracking feature!',
              action: {
                label: 'Learn More',
                onClick: () => notifyInfo('Redirecting to features...')
              }
            })}
            className="btn-secondary"
          >
            Action Notification
          </button>

          <button
            onClick={() => showNotification({
              type: 'warning',
              title: 'Maintenance Notice',
              message: 'System maintenance scheduled for tonight',
              duration: 8000
            })}
            className="btn-secondary"
          >
            Long Notification
          </button>
        </div>
      </div>

      {/* Tooltip Demos */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Tooltip Components</h2>
        <div className="flex flex-wrap gap-4">
          <Tooltip content="This tooltip appears on top" position="top">
            <button className="btn-primary">Top Tooltip</button>
          </Tooltip>

          <Tooltip content="This tooltip appears on the right" position="right">
            <button className="btn-secondary">Right Tooltip</button>
          </Tooltip>

          <Tooltip content="This tooltip appears on the bottom" position="bottom">
            <button className="btn-secondary">Bottom Tooltip</button>
          </Tooltip>

          <Tooltip content="This tooltip appears on the left" position="left">
            <button className="btn-secondary">Left Tooltip</button>
          </Tooltip>

          <Tooltip content="This is a longer tooltip with more detailed information about the feature" position="top">
            <button className="btn-secondary">Long Tooltip</button>
          </Tooltip>
        </div>
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

export default PopupDemo
