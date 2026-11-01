(function(){
  const ACCOUNTS_KEY = "hrFramAccounts";
  const SESSION_KEY = "hrFramSession";

  const starterAccounts = [
    {
      email:"demo@hrfram.test",
      password:"Demo1234",
      fullName:"Demo Farmer",
      username:"demo_farmer",
      role:"user"
    },
    {
      email:"admin@hrfram.test",
      password:"Admin1234",
      fullName:"HR Fram Administrator",
      username:"hrfram_admin",
      role:"admin"
    }
  ];

  function readAccounts(){
    try{
      const data = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    }catch(error){
      return [];
    }
  }

  function saveAccounts(accounts){
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function ensureAccounts(){
    const accounts = readAccounts();

    starterAccounts.forEach(function(starter){
      const exists = accounts.some(function(account){
        return String(account.email || "").toLowerCase() === starter.email.toLowerCase();
      });

      if(!exists){
        accounts.push(starter);
      }
    });

    saveAccounts(accounts);
    return accounts;
  }

  function findAccount(email){
    const normalized = String(email || "").trim().toLowerCase();

    return ensureAccounts().find(function(account){
      return String(account.email || "").toLowerCase() === normalized;
    }) || null;
  }

  function authenticate(email,password){
    const account = findAccount(email);

    if(!account || account.password !== password){
      return null;
    }

    return account;
  }

  function usernameExists(username){
    const normalized = String(username || "").toLowerCase();

    return ensureAccounts().some(function(account){
      return String(account.username || "").toLowerCase() === normalized;
    });
  }

  function makeUsername(fullName,email){
    let base = String(fullName || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g,"_")
      .replace(/^_+|_+$/g,"");

    if(!base){
      base = String(email || "").split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g,"_");
    }

    base = (base || "user").slice(0,16);

    let candidate = base;
    let number = 2;

    while(usernameExists(candidate)){
      candidate = (base.slice(0,14) + "_" + number).slice(0,20);
      number++;
    }

    return candidate;
  }

  function registerAccount(fullName,email,password){
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if(findAccount(normalizedEmail)){
      return {ok:false,error:"An account with this email already exists."};
    }

    const account = {
      email:normalizedEmail,
      password:password,
      fullName:String(fullName || "").trim(),
      username:makeUsername(fullName,normalizedEmail),
      role:"user"
    };

    const accounts = ensureAccounts();
    accounts.push(account);
    saveAccounts(accounts);

    return {ok:true,account:account};
  }

  function updatePassword(email,newPassword){
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const accounts = ensureAccounts();
    const index = accounts.findIndex(function(account){
      return String(account.email || "").toLowerCase() === normalizedEmail;
    });

    if(index < 0){
      return false;
    }

    accounts[index].password = newPassword;
    saveAccounts(accounts);
    return true;
  }

  function getSession(){
    try{
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    }catch(error){
      return null;
    }
  }

  function setSession(account){
    const session = {
      email:account.email,
      fullName:account.fullName,
      username:account.username,
      role:account.role || "user",
      loggedInAt:new Date().toISOString()
    };

    localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    return session;
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  }

  function applyNavigation(){
    const session = getSession();
    const isAdmin = Boolean(session && session.role === "admin");

    document.querySelectorAll("[data-auth-guest]").forEach(function(el){
      el.style.display = session ? "none" : "";
    });

    document.querySelectorAll("[data-auth-user]").forEach(function(el){
      el.style.display = session ? "" : "none";
    });

    document.querySelectorAll("[data-auth-admin]").forEach(function(el){
      el.style.display = isAdmin ? "" : "none";
    });

    document.querySelectorAll("[data-auth-name]").forEach(function(el){
      el.textContent = session
        ? (session.fullName || session.username || "User")
        : "User";
    });
  }

  function guardUser(){
    if(!getSession()){
      window.location.replace("login.html?next=dashboard");
      return false;
    }
    return true;
  }

  function guardAdmin(){
    const session = getSession();

    if(!session){
      window.location.replace("login.html?next=admin");
      return false;
    }

    if(session.role !== "admin"){
      window.location.replace("dashboard.html");
      return false;
    }

    return true;
  }

  window.HRFramAuth = {
    ensureAccounts:ensureAccounts,
    findAccount:findAccount,
    authenticate:authenticate,
    registerAccount:registerAccount,
    updatePassword:updatePassword,
    getSession:getSession,
    setSession:setSession,
    logout:logout,
    applyNavigation:applyNavigation,
    guardUser:guardUser,
    guardAdmin:guardAdmin
  };

  ensureAccounts();

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",applyNavigation);
  }else{
    applyNavigation();
  }
})();