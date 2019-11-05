class FriendList {
  friends = []

  addFriend(name) {
    this.friends.push(name)
    this.announceFriendShip(name)
  }

  announceFriendShip(name) {
    global.console.log(`${name} is now a friend`)
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name)
    if (idx === -1) {
      throw new Error('Friend does not exist')
    }
    this.friends.splice(idx, 1)
  }
}

describe('FriendList', () => {

  let friendsList
  beforeEach(() => {
    friendsList = new FriendList()
  })
  it('should initialize friends list', () => {
    expect(friendsList.friends.length).toEqual(0)
  })
  it('should add a friend to the friends list', () => {
    friendsList.addFriend('Denis')
    expect(friendsList.friends.length).toEqual(1)
  })
  it('should announce friendship', () => {
    friendsList.announceFriendShip = jest.fn()
    expect(friendsList.announceFriendShip).not.toHaveBeenCalled()

    friendsList.addFriend('Denis')
    expect(friendsList.announceFriendShip).toHaveBeenCalled()
  })

  describe('Remove friend', () => {
    it('should remove a friend from the friends list', () => {
      friendsList.addFriend('Denis')
      expect(friendsList.friends[0]).toEqual('Denis')
      friendsList.removeFriend('Denis')
      expect(friendsList.friends[0]).toBeUndefined()

    })
    it('should throw an error because friend does not exist', () => {
      expect(() => friendsList.removeFriend('Denis')).toThrow()

    })
  })
})
