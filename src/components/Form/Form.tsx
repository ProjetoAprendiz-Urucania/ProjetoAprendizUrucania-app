import { useState } from "react";
import imLogo from "../../assets/img/Form/im_logo.png"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
      <div style={{ backgroundColor: "white", paddingTop: "12px", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", width: "260px", display:"grid", justifyContent:"center"}}>
       
        <img src={imLogo} alt="" width="40px" style={{marginBottom:"22px", justifySelf:"right"}}/>

        <form onSubmit={handleSubmit} style={{ display: "grid", flexDirection: "column", gap: "16px" , justifyItems:"center"}}>
          <div className="field" style={{ marginTop:"1.2em"}}>
            <label style={{ display: "block", color: "#4a4a4a", marginBottom: "4px" , 
                            position:"absolute", transform: "translateY(-50%)", paddingLeft:"3px",
                            marginLeft:"25px", paddingRight:"4px",backgroundColor:"white" }}>Email</label>
            <input
              type="email"
              style={{ width: "215px", padding: "8px", border: "2px solid #1f1f1f", borderRadius: "4px" , marginBottom:"1.1em"}}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label style={{ display: "block", color: "#4a4a4a", marginBottom: "4px" , 
                            position:"absolute", transform: "translateY(-50%)", paddingLeft:"3px",
                            marginLeft:"25px", paddingRight:"4px",backgroundColor:"white"}}>Senha</label>
            <input
              type="password"
              style={{ width: "215px", padding: "8px", border: "2px solid #1f1f1f", borderRadius: "4px" , marginBottom:"0.8em" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{ height:"1.7em",width: "5.3em", backgroundColor: "#dc2626", color: "white", paddingTop:"0",paddingBottom: "10px",
               borderRadius: "4px", border: "none", cursor: "pointer",marginTop:"20px", display:"grid", justifyContent:"center"}}
          >
            <span >
              Entrar
            </span>
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "14px" , textDecoration:"underline"}}>
          <a href="#" style={{ fontSize: "11px", color: "#6b7280", textDecoration: "none" }}>
            Registrar-se
          </a>
        </div>
      </div>
  );
}
