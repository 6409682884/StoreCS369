//6409682884
import './App.css';
import DataTable from 'react-data-table-component';
import { useEffect, useState } from 'react';
import React from 'react';

function App() {
  const [data, setData] = useState(null);
  const [datafilter, setDataFilter] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [statusAuth, setStatusAuth] = useState(false);
  const datas = []
  const hostIpAddress = "localhost" //แก้ตรงนี้ทุกครั้งที่ ip localhost เปลี่ยนอย่างเช่นปิด-เปิด aws ec2 ใหม่
  // Get Data From API
  const fetchDataForPosts = async () => {
    try {
      const response = await fetch(`http://` + hostIpAddress + `:8080/api/product`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const postsData = await response.json();
      setData(postsData.data[0]);
      setDataFilter(postsData.data[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.log(error)
      setData(null);
    } finally {
      setPending(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDataForPosts();
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // ตั้งค่าหัวตาราง
  const HeaderColumns =
    [
      {
        name: 'ProductID',
        selector: row => row.ProductID
      },
      {
        name: 'ProductName',
        cell: row => <button className='name' onClick={() => handleClickInfo(row.ProductID)}>{row.ProductName}</button>
      },
      {
        name: 'Price',
        selector: row => row.Price
      },
      {
        name: 'Picture',
        cell: row => <img src={"http://" + hostIpAddress + ":8080/uploads/" + row.Picture} alt="Product Image" className='multi' />
      },
      {
        name: 'Detail',
        selector: row => <button className='buttonMD' onClick={() => handleClickInfo(row.ProductID)}>More details</button>
      },
    ];

  // ตั้งค่ารูปแบบตาราง
  const customStyles = {
    rows: {
      style: {
        fontSize: '16px',
        minHeight: '72px', // override the row height
      },
    },
    headCells: {
      style: {
        fontSize: '18px',
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  // set state เปิด-ปิด form
  const [statusAdd, setStatusAdd] = useState(false);
  const [statusInfo, setStatusInfo] = useState(false);
  // ฟังก์ชันกรองข้อมูล
  function handleFilter(event) {
    const newData = datafilter.filter(row => {
      return row.ProductName.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setData(newData)
  }
  // ฟังก์ชันเปิดฟอร์มเพิ่มสินค้า
  function handleClickAdd(event) {
    setStatusAdd(true)
  }
  // ฟังก์ชันปิดฟอร์ม
  function handleClickCloseForm(event) {
    setStatusAdd(false)
  }
  // ฟังก์ชันเปิดข้อมูลราลละเอียดสินค้า
  const handleClickInfo = (ProductID) => {
    setStatusInfo(true);
    window.scrollTo({
      top: 0
    });
    fetch(`http://` + hostIpAddress + `:8080/api/product/${ProductID}`, {
      method: "GET",
      headers: { 'content-type': 'application/json' },
    })
      .then(res => {
        if (res.ok) {
          return res.json(); // Parse the response body as JSON
        } else {
          throw new Error(`Failed to GET ProductID ${ProductID}`);
        }
      })
      .then(Product => {
        // console.log(Product)
        setInfo(Product.data);
        // Set statusInfo after the fetch request completes
        console.log(`GET ProductID ${ProductID} successfully`);
        // console.log(Product.data.ProductName)
      })
      .catch(error => {
        console.error(`Error fetching ProductID ${ProductID}:`, error);
      });
  }
  // ฟังก์ชันปิดข้อมูลสินค้า
  function handleClickCloseInfo(event) {
    setStatusInfo(false)
  }
  // ฟังก์ชันเปิดภาพเต็ม
  const handleClickImage = () => {
    setShowFullImage(true);
  };
  // ฟังก์ชันปิดภาพเต็ม
  const handleCloseFullImage = () => {
    setShowFullImage(false);
  };

  const [formValue, setFormValue] = useState({ ProductName: '', Price: '' })
  const [loginValue, setLoginValue] = useState({ Username: '', Password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  // ฟังก์ชันจัดการข้อมูลในฟอร์ม
  const handlePostProduct = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  }
  // ฟังก์ชันจัดการข้อมูลการเข้าสู่ระบบ
  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginValue({ ...loginValue, [name]: value });
  }
  // ฟังก์ชันอัปโหลดไฟล์รูปภาพ
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://" + hostIpAddress + ":8080/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
// ฟังก์ชันลบรูปภาพ
  const DeleteImage = async (ProductID) => {
    fetch(`http://` + hostIpAddress + `:8080/api/product/${ProductID}`, {
      method: "GET",
      headers: { 'content-type': 'application/json' },
    })
      .then(res => {
        if (res.ok) {
          return res.json(); // Parse the response body as JSON
        } else {
          throw new Error(`Failed to DELETE ProductID ${ProductID}`);
        }
      })
      .then(Product => {
        console.log(Product)
        const response = fetch(`http://` + hostIpAddress + `:8080/delete/${Product.data.Picture}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          throw new Error("Failed to Delete file");
        }
        console.log(`DELETE ProductID ${ProductID} successfully`);
        // console.log(Product.data.ProductName)
      })
      .catch(error => {
        console.error(`Error fetching ProductID ${ProductID}:`, error);
      });
  }
// ฟังก์ชันเข้าสู่ระบบ
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true)
    const allInputValue = {
      Username: loginValue.Username,
      Password: loginValue.Password
    };

    let res = await fetch("http://" + hostIpAddress + ":8080/Authen/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(allInputValue)
    });

    if (res.status === 200) {
      setStatusAuth(true)
      setLoginLoading(false)
      fetchDataForPosts();
      return (
        alert('Login Successful')
      );
    } else {
      setStatusAuth(false)
      setLoginLoading(false)
      fetchDataForPosts();
      return (
        alert('Login Fail')
      );
    }
  }

  const [preview, setPreview] = useState(null);
   // ฟังก์ชันจัดการภาพตอนเลือกภาพขณะเพิ่มสินค้า
  const handleImageChange = (e) => {
    const img = e.target.files[0];
    setFile(img)
    if (img) {
      const reader = new FileReader();
      // Generate a preview URL for the selected image
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(img);
    }
    else {
      setPreview(null);
    }

  };

  // ฟังก์ชันกด submit เพิ่มข้อมูลสินค้า
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClickCloseForm();
    const img = await upload();
    // รวมข้อมูลทั้งหมดที่ต้องการส่งไปยัง API
    const allInputValue = { ProductName: formValue.ProductName == "" ? null : formValue.ProductName, Picture: img ? img : null, Price: formValue.Price, Description: formValue.Description, Size: formValue.Size, Material: formValue.Material }
    // ส่งข้อมูลไปยัง API ด้วยเมธอด POST
    let res = await fetch("http://" + hostIpAddress + ":8080/api/product", {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(allInputValue)
    })
// ตรวจสอบสถานะการส่งข้อมูล
    if (res.status === 200) {
      setStatusAdd(false)
      fetchDataForPosts();
      return (
        alert('เพิ่มสินค้าสำเร็จ ชื่อสินค้า: ' + allInputValue.ProductName)
      );
    } else {
      // ถ้าเกิดข้อผิดพลาดในการส่งข้อมูล ลบรูปภาพที่อัปโหลดไว้
      fetch(`http://` + hostIpAddress + `:8080/delete/${allInputValue.Picture}`, {
        method: "DELETE"
      });
      return (
        alert('เพิ่มสินค้าไม่สำเร็จ กรุณากรอกชื่อและราคาสินค้าด้วย ^.^,')
      );
    }
  }

  // ฟังก์ชันสำหรับการลบข้อมูลจากฐานข้อมูล
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
    console.log(state.selectedRows)
    console.log(selectedRows)
    console.log(setSelectedRows)
  }, []);

  const contextActions = React.useMemo(() => {
    //กด delete
    const handleDelete = (id) => {
      if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.ProductName)}?`)) {
        setToggleCleared(!toggleCleared);
        console.log(selectedRows) 
        const ProductIDs = selectedRows.map(item => item.ProductID);
        ProductIDs.forEach(ProductID => {
          DeleteImage(ProductID); // ลบรูปภาพที่เกี่ยวข้องกับสินค้า
          // ส่งคำร้องขอลบข้อมูลไปยัง API
          fetch(`http://` + hostIpAddress + `:8080/api/product/${ProductID}`, {
            method: "DELETE",
            headers: { 'content-type': 'application/json' },
          })
            .then(res => {
              if (res.status === 200) {
                setStatusAdd(false);
                fetchDataForPosts();
                console.log(`ProductID ${ProductID} deleted successfully`);
              } else {
                console.error(`Failed to delete ShipperID ${ProductID}`);
              }
            })
            .catch(error => {
              console.error(`Error deleting ProductID ${ProductID}:`, error);
            });
        });
        alert('Successfully delete requests sent for selected rows.');
      }
    };
    return (
      <button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }}>Delete</button>
    );
  }, [data, selectedRows, toggleCleared]);

  return (
    <div className='container'>
      <div style={{ alignSelf: 'end', display: 'flex', justifyContent: 'space-evenly', gap: '0.5rem' }}>
        {statusAdd === false && statusInfo === false && (
          <div>
            {statusAuth === true ? <><button onClick={handleClickAdd}>+ Add Product</button> <button onClick={() => { setStatusAuth(false) }}>Logout</button></> :
              <form id='loginForm' onSubmit={handleLogin} method="POST">
                <label>Username: </label>
                <input name="Username" type="text" placeholder="Username" value={loginValue.Username} onChange={handleLoginInput} />
                <label>Password: </label>
                <input name="Password" type="password" placeholder="Password" value={loginValue.Password} onChange={handleLoginInput} />
                <button type='submit'>Login</button>
                {loginLoading === true && (<span>Logging in...</span>)}
              </form>
            }
            <input type='text' placeholder='Search Product Name' onChange={handleFilter} style={{ margin: '0 0.5rem 0 0.5rem' }} />
          </div>)}
        {statusAdd === true && <button onClick={handleClickCloseForm}>X</button>}
        {statusInfo === true && <button onClick={handleClickCloseInfo}>X</button>}
      </div>
      {statusAdd === false && statusInfo === false && (
        <div>
          <DataTable
            theme="default"
            title="Store"
            columns={HeaderColumns}
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            data={data || datas}
            customStyles={customStyles}
            progressPending={pending}
            pagination
          />
        </div>)}
      {statusAdd === true &&
        <div>
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
            onSubmit={handleSubmit}
            method="POST"
          >
            <div><h4>เพิ่มรายการสินค้า</h4></div>
            <div>
              <input
                type="text"
                placeholder="ProductName"
                name="ProductName"
                value={formValue.ProductName}
                onChange={handlePostProduct}
              />
            </div>
            <div >
              <input
                type="file"
                placeholder="Picture"
                name="Picture"
                accept=".jpg, .jpeg, .png"
                value={formValue.Picture}
                onChange={handleImageChange}
              />
            </div>
            {preview && (
              <div>
                <img src={preview} alt="Selected Image" width="150" height="150" />
              </div>
            )}
            <div>
              <input
                type="number"
                placeholder="Price"
                name="Price"
                value={formValue.Price}
                onChange={handlePostProduct}
              />
            </div>
            <div>
              <textarea
                type="text"
                placeholder="Description"
                name="Description"
                value={formValue.Description}
                onChange={handlePostProduct}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Size"
                name="Size"
                value={formValue.Size}
                onChange={handlePostProduct}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Material"
                name="Material"
                value={formValue.Material}
                onChange={handlePostProduct}
              />
            </div>
            <div>
              <button type="submit">
                submit
              </button>
            </div>

          </form>
        </div>}
      {statusInfo === true && info ? (
        <div>
          <div className='box'>
            {showFullImage && (
              <div className="full-image-container" onClick={handleCloseFullImage}>
                <button className="close-button" onClick={handleCloseFullImage}>X</button>
                <img className="full-image" src={'http://' + hostIpAddress + ':8080/uploads/' + info.Picture} alt="Full Size Image" />
              </div>
            )}
            <img className='single' src={'http://' + hostIpAddress + ':8080/uploads/' + info.Picture} alt="Thumbnail Image" onClick={handleClickImage} />
            <div id='flex-contianer'>
              <div id='infoleft'>
                <p id='id'>ID: {info.ProductID}</p>
                <p id='productname'>{info.ProductName}</p>
                <p id='price'>{info.Price} ฿</p>
              </div>
              <div id='infocenter'>
                <label id='head'>รายละเอียดสินค้า</label>
                <p id='description'>{info.description}</p>
              </div>
              <div id='inforight'>
                <label id='headsize'>ขนาดสินค้า</label>
                <p id='size'>{info.size}</p>
                <label id='headmaterial'>วัสดุ/วัตถุดิบสินค้า</label>
                <p id='material'>{info.material}</p>
              </div>
            </div>
          </div>
        </div>
      ) : statusInfo === true && (
        <h3>Loading...</h3>
      )}
    </div>
  );
}

export default App;
