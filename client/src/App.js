import './App.css';
import { useState, useEffect } from "react";
import Axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState("");

  const [employeeList, setEmployeeList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);
  const [currentView, setCurrentView] = useState('active'); // 'active' or 'archived'
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isUnarchiveModalOpen, setIsUnarchiveModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employeeToArchive, setEmployeeToArchive] = useState(null);
  const [employeeToUnarchive, setEmployeeToUnarchive] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [updateName, setUpdateName] = useState("");
  const [updateAge, setUpdateAge] = useState("");
  const [updateCountry, setUpdateCountry] = useState("");
  const [updatePosition, setUpdatePosition] = useState("");
  const [updateWage, setUpdateWage] = useState("");

  // Load employees on mount
  useEffect(() => {
    getEmployees();
    getArchivedEmployees();
  }, []);

  const addEmployee = () => {
    if (!name || !age || !country || !position || !wage) {
      alert('Please fill in all fields');
      return;
    }

    Axios.post('http://localhost:3001/create', {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage
    }).then(() => {
      // Clear form
      setName("");
      setAge("");
      setCountry("");
      setPosition("");
      setWage("");
      // Close modal
      setIsAddModalOpen(false);
      // Refresh the list
      getEmployees();
    }).catch(err => {
      console.error(err);
      alert('Error adding employee');
    });
  };

  const getEmployees = () => {
    Axios.get('http://localhost:3001/employees').then((response) => {
      setEmployeeList(response.data);
    }).catch(err => {
      console.error(err);
      alert('Error fetching employees');
    });
  };

  const getArchivedEmployees = () => {
    Axios.get('http://localhost:3001/employees/archived').then((response) => {
      setArchivedList(response.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setName("");
    setAge("");
    setCountry("");
    setPosition("");
    setWage("");
  };

  const openUpdateModal = (employee) => {
    setEditingEmployee(employee);
    setUpdateName(employee.name);
    setUpdateAge(employee.age);
    setUpdateCountry(employee.country);
    setUpdatePosition(employee.position);
    setUpdateWage(employee.wage);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setEditingEmployee(null);
  };

  const updateEmployee = () => {
    if (!updateName || !updateAge || !updateCountry || !updatePosition || !updateWage) {
      alert('Please fill in all fields');
      return;
    }

    Axios.put('http://localhost:3001/update', {
      id: editingEmployee.id,
      name: updateName,
      age: updateAge,
      country: updateCountry,
      position: updatePosition,
      wage: updateWage
    }).then(() => {
      closeUpdateModal();
      getEmployees();
      getArchivedEmployees();
    }).catch(err => {
      console.error(err);
      alert('Error updating employee');
    });
  };

  const openArchiveModal = (employee) => {
    setEmployeeToArchive(employee);
    setIsArchiveModalOpen(true);
  };

  const closeArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setEmployeeToArchive(null);
  };

  const confirmArchiveEmployee = () => {
    if (employeeToArchive) {
      Axios.put(`http://localhost:3001/archive/${employeeToArchive.id}`).then(() => {
        closeArchiveModal();
        getEmployees();
        getArchivedEmployees();
      }).catch(err => {
        console.error(err);
        alert('Error archiving employee');
      });
    }
  };

  const openUnarchiveModal = (employee) => {
    setEmployeeToUnarchive(employee);
    setIsUnarchiveModalOpen(true);
  };

  const closeUnarchiveModal = () => {
    setIsUnarchiveModalOpen(false);
    setEmployeeToUnarchive(null);
  };

  const confirmUnarchiveEmployee = () => {
    if (employeeToUnarchive) {
      Axios.put(`http://localhost:3001/unarchive/${employeeToUnarchive.id}`).then(() => {
        closeUnarchiveModal();
        getEmployees();
        getArchivedEmployees();
      }).catch(err => {
        console.error(err);
        alert('Error unarchiving employee');
      });
    }
  };

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      Axios.delete(`http://localhost:3001/delete/${employeeToDelete.id}`).then(() => {
        closeDeleteModal();
        getArchivedEmployees();
      }).catch(err => {
        console.error(err);
        alert('Error deleting employee');
      });
    }
  };

  const currentList = currentView === 'active' ? employeeList : archivedList;

  return (
    <div className="App">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <h1>Employee Management System</h1>
          <p>Streamline your workforce management with ease</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{employeeList.length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{archivedList.length}</span>
            <span className="stat-label">Archived</span>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className='employees'>
        <div className="employees-header">
          <div className="view-tabs">
            <button 
              className={`tab-button ${currentView === 'active' ? 'active' : ''}`}
              onClick={() => setCurrentView('active')}
            >
              Active Employees
            </button>
            <button 
              className={`tab-button ${currentView === 'archived' ? 'active' : ''}`}
              onClick={() => setCurrentView('archived')}
            >
              Archived
            </button>
          </div>
          <button className="btn-add-employee" onClick={openAddModal}>
            + Add Employee
          </button>
        </div>

        <div>
          {currentList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No {currentView === 'active' ? 'Active' : 'Archived'} Employees</h3>
              <p>
                {currentView === 'active' 
                  ? "Start building your team by adding employees using the 'Add Employee' button above" 
                  : "Archived employees will appear here"}
              </p>
            </div>
          ) : (
            currentList.map((val) => {
              return (
                <div className='employee' key={val.id}>
                <div className="employee-info">
                  <label>Name</label>
                  <span>{val.name}</span>
                </div>
                <div className="employee-info">
                  <label>Age</label>
                  <span>{val.age}</span>
                </div>
                <div className="employee-info">
                  <label>Country</label>
                  <span>{val.country}</span>
                </div>
                <div className="employee-info">
                  <label>Position</label>
                  <span>{val.position}</span>
                </div>
                <div className="employee-info">
                  <label>Wage</label>
                  <span>${val.wage.toLocaleString()}</span>
                </div>
                <div className="employee-actions">
                  <button className="btn-update" onClick={() => openUpdateModal(val)}>
                    ✏️ Edit
                  </button>
                  {currentView === 'active' ? (
                    <button className="btn-archive" onClick={() => openArchiveModal(val)}>
                      📦 Archive
                    </button>
                  ) : (
                    <>
                      <button className="btn-unarchive" onClick={() => openUnarchiveModal(val)}>
                        ↩️ Restore
                      </button>
                      <button className="btn-delete" onClick={() => openDeleteModal(val)}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Employee</h2>
              <button className="btn-close" onClick={closeAddModal}>×</button>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input 
                type="text"
                value={name}
                placeholder="Enter employee name"
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input 
                type="number"
                value={age}
                placeholder="Enter age"
                onChange={(event) => setAge(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input 
                type="text"
                value={country}
                placeholder="Enter country"
                onChange={(event) => setCountry(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input 
                type="text"
                value={position}
                placeholder="Enter position"
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Wage (year)</label>
              <input 
                type="number"
                value={wage}
                placeholder="Enter annual wage"
                onChange={(event) => setWage(event.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={addEmployee}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Employee Details</h2>
              <button className="btn-close" onClick={closeUpdateModal}>×</button>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input 
                type="text"
                value={updateName}
                onChange={(event) => setUpdateName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input 
                type="number"
                value={updateAge}
                onChange={(event) => setUpdateAge(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input 
                type="text"
                value={updateCountry}
                onChange={(event) => setUpdateCountry(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input 
                type="text"
                value={updatePosition}
                onChange={(event) => setUpdatePosition(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Wage (year)</label>
              <input 
                type="number"
                value={updateWage}
                onChange={(event) => setUpdateWage(event.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeUpdateModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={updateEmployee}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {isArchiveModalOpen && employeeToArchive && (
        <div className="modal-overlay" onClick={closeArchiveModal}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Archive</h2>
              <button className="btn-close" onClick={closeArchiveModal}>×</button>
            </div>

            <div className="confirm-message">
              <div className="confirm-icon">📦</div>
              <p>Are you sure you want to archive <strong>{employeeToArchive.name}</strong>?</p>
              <p className="confirm-warning">You can restore this employee later from the archived list.</p>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeArchiveModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={confirmArchiveEmployee}>
                Yes, Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unarchive Confirmation Modal */}
      {isUnarchiveModalOpen && employeeToUnarchive && (
        <div className="modal-overlay" onClick={closeUnarchiveModal}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Restore</h2>
              <button className="btn-close" onClick={closeUnarchiveModal}>×</button>
            </div>

            <div className="confirm-message">
              <div className="confirm-icon">↩️</div>
              <p>Are you sure you want to restore <strong>{employeeToUnarchive.name}</strong>?</p>
              <p className="confirm-warning">This employee will be moved back to the active list.</p>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeUnarchiveModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={confirmUnarchiveEmployee}>
                Yes, Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && employeeToDelete && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Delete</h2>
              <button className="btn-close" onClick={closeDeleteModal}>×</button>
            </div>

            <div className="confirm-message">
              <div className="confirm-icon">⚠️</div>
              <p>Are you sure you want to permanently delete <strong>{employeeToDelete.name}</strong>?</p>
              <p className="confirm-warning">This action cannot be undone.</p>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={confirmDeleteEmployee}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
