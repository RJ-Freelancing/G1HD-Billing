import userRepo from '../models/userModel'

export async function checkPermissionRights(reqestedUser, currentUser, ifUsers) {
  if (currentUser.userType == "reseller") {
    if (ifUsers == 1) {
      if (currentUser.username !== reqestedUser.username) return false
    }
    else {
      if (!currentUser.childUsernames.includes(reqestedUser)) return false
    }
  }
  if (currentUser.userType == "superReseller") {
    if (ifUsers == 1) {
      if (currentUser.userType == reqestedUser.userType) {
        if (currentUser.username !== reqestedUser.username) return false
      }
      else {
        if (!currentUser.childUsernames.includes(reqestedUser.username)) return false
      }
    }
    else {
      const resellers = await userRepo.find({ username: { $in: currentUser.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
      const childUsers = [].concat(...resellers.map(reseller => reseller.childUsernames))
      if (!childUsers.includes(reqestedUser)) return false
    }
  }
  if (currentUser.userType == "admin") {
    const superResellers = await userRepo.find({ username: { $in: currentUser.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    const childResellers = [].concat(...superResellers.map(superReseller => superReseller.childUsernames))
    if (ifUsers == 1) {
      if (currentUser.userType == reqestedUser.userType) {
        if (currentUser.username !== reqestedUser.username) return false
      }
      else {
        if (reqestedUser.userType == 'superReseller') {
          if (!currentUser.childUsernames.includes(reqestedUser.username)) return false
        }
        else {
          if (!childResellers.includes(reqestedUser.username)) return false
        }
      }
    }
    else {
      const resellers = await userRepo.find({ username: { $in: childResellers } }, null, { sort: { creditsAvailable: 1 } })
      const childUsers = [].concat(...resellers.map(reseller => reseller.childUsernames))
      if (!childUsers.includes(reqestedUser)) return false
    }
  }
  return true
}

export async function checkPermissionMinistra(reqestedMacs, currentUser) {
  if (currentUser.userType == "reseller") {
    if (Array.isArray(reqestedMacs)) return reqestedMacs.every(e => currentUser.childUsernames.includes(e))
    return currentUser.childUsernames.includes(reqestedMacs)
  }
  if (currentUser.userType == "superReseller") {
    const resellers = await userRepo.find({ username: { $in: currentUser.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    const childUsers = [].concat(...resellers.map(reseller => reseller.childUsernames))
    if (Array.isArray(reqestedMacs)) return reqestedMacs.every(e => childUsers.includes(e))
    return childUsers.includes(reqestedMacs)
  }
  if (currentUser.userType == "admin") {
    const superResellers = await userRepo.find({ username: { $in: currentUser.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    const childResellers = [].concat(...superResellers.map(superReseller => superReseller.childUsernames))
    const resellers = await userRepo.find({ username: { $in: childResellers } }, null, { sort: { creditsAvailable: 1 } })
    const childUsers = [].concat(...resellers.map(reseller => reseller.childUsernames))
    if (Array.isArray(reqestedMacs)) return reqestedMacs.every(e => childUsers.includes(e))
    return childUsers.includes(reqestedMacs)
  }
  return true
}

export async function validParent(currentUserType, addingUserType, upgradingUser) {
  if(upgradingUser == undefined){
    if (currentUserType == 'superAdmin' && addingUserType == 'admin') return true
    if (currentUserType == 'admin' && addingUserType == 'superReseller') return true
    if (currentUserType == 'superReseller' && addingUserType == 'reseller') return true
    if (currentUserType == 'reseller') return false
    if (addingUserType == 'superAdmin') return false
}
else {
    const upgradingUserType = upgradingUser.userType
    if (currentUserType == 'superAdmin' && addingUserType == 'admin' && upgradingUserType == 'superReseller') return true
    if (currentUserType == 'admin' && addingUserType == 'superReseller' && upgradingUserType == 'reseller') return true
    if (currentUserType == 'superReseller') return false
    if (currentUserType == 'reseller') return false
    if (addingUserType == 'superAdmin') return false
}
  return false
}