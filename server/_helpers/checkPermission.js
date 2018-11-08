import userRepo from '../models/userModel'

export async function checkPermissionRights(reqestedUser, currentUser, ifUsers) {
  if (currentUser.userType == "reseller"){
    if(ifUsers == 1){
      if(currentUser.username !== reqestedUser.username) return false
    }
    else {
      if(!currentUser.childUsernames.includes(reqestedUser)) return false
    }
  }
  if (currentUser.userType == "super-reseller"){
    if(ifUsers == 1){
      if (currentUser.userType == reqestedUser.userType) {
        if(currentUser.username !== reqestedUser.username) return false
      }
      else {
        if(!currentUser.childUsernames.includes(reqestedUser.username)) return false
      }
    }
    else {
      const resellers = await userRepo.find({username: { $in: currentUser.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
      const childUsers = [].concat(...resellers.map(reseller=>reseller.childUsernames))
      if(!childUsers.includes(reqestedUser)) return false
    }
  }
  if (currentUser.userType == "admin"){
    const superResellers = await userRepo.find({username: { $in: currentUser.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
    const childResellers = [].concat(...superResellers.map(superReseller=>superReseller.childUsernames))
    if(ifUsers == 1){
      if (currentUser.userType == reqestedUser.userType) {
        if(currentUser.username !== reqestedUser.username) return false
      }
      else {
        if(reqestedUser.userType == 'super-reseller'){
          if(!currentUser.childUsernames.includes(reqestedUser.username)) return false
        }
        else {
          if(!childResellers.includes(reqestedUser.username)) return false
        }
      }
    }
    else {
      const resellers = await userRepo.find({username: { $in: childResellers}}, null, { sort: { creditsAvailable: 1 } })
      const childUsers = [].concat(...resellers.map(reseller=>reseller.childUsernames))
      if(!childUsers.includes(reqestedUser)) return false
    }
  }
  return true
}

export async function validParent(currentUserType, addingUserType){
  console.log("XXX : " + currentUserType + " : " + addingUserType)
  if(currentUserType == 'super-admin' && addingUserType == 'admin') return true
  if(currentUserType == 'admin' && addingUserType == 'super-reseller') return true
  if(currentUserType == 'super-reseller' && addingUserType == 'reseller') return true
  if(currentUserType == 'reseller') return false
  if(addingUserType == 'super-admin') return false
  return false
}