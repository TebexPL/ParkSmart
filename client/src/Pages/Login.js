import './styles/Login.css';

function Login(props) {

  const login = async () => {
    const data = {};
    data.name = document.getElementById("inputName").value;
    data.password = document.getElementById("inputPass").value;

    const messageBox = document.getElementById('loginBox');
     messageBox.innerText = "Logging in...";
    if(data.name.trim() === '' ||
       data.password.trim() === ''){

       messageBox.innerText = "Please fill every box";
       return;
       }

       try{
         const res = await fetch("https://park--smart.herokuapp.com/api/user", {
           method: "POST",
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(data)
         })
         if(res.status !==200){
             messageBox.innerText = await res.text();
              return;
         }
         const resData = await res.json();
         localStorage.setItem('token', resData.token);
         window.location.replace('/');
       }
       catch(error){
         messageBox.innerText = "Server error";
         console.log(error);
       }

  }

  return (
    <div className='loginContainer'>
      <div className="loginBox">
        <h3 id='loginBox'>Log in</h3>
        <input id='inputName' placeholder="Name" />
        <input id='inputPass' type="password" placeholder="Password" />
        <button onClick={() => login()}>Log in</button>
      </div>
    </div>

  );
}

export default Login;
