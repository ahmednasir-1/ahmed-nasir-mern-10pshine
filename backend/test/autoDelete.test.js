import { expect, server } from './setup.js'
import {Note} from '../src/models/note.model.js'
import {User} from '../src/models/user.model.js'

describe('Auto Delete  [autoDelete.test.js]', () => {

  let userId

  before(async () => {
    const user = await User.create({
      name: 'John',
      email: 'autodelete@gmail.com',
      password: '123456'
    })
    userId = user._id
  })

  beforeEach(async () => {
    await Note.deleteMany({})
  })

  it('should delete notes older than 30 days', async () => {
    // create note deleted 31 days ago
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 31)

    await Note.create({
      title: 'Old Note',
      content: '<p>Old</p>',
      user: userId,
      isDeleted: true,
      deletedAt: oldDate  
    })

    // run delete logic
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await Note.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    })

    expect(result.deletedCount).to.equal(1)
  })

  it('should not delete notes newer than 30 days', async () => {
    // create note deleted 5 days ago
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 5)

    await Note.create({
      title: 'Recent Note',
      content: '<p>Recent</p>',
      user: userId,
      isDeleted: true,
      deletedAt: recentDate  
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await Note.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    })

    expect(result.deletedCount).to.equal(0)
  })

  it('should not delete notes that are not in trash', async () => {
    // create normal note (not deleted)
    await Note.create({
      title: 'Normal Note',
      content: '<p>Normal</p>',
      user: userId,
      isDeleted: false  
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await Note.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    })

    expect(result.deletedCount).to.equal(0)
  })

  it('should delete multiple old notes at once', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 31)

    // create 3 old notes
    await Note.create([
      { title: 'Note 1', content: '<p>1</p>', user: userId, isDeleted: true, deletedAt: oldDate },
      { title: 'Note 2', content: '<p>2</p>', user: userId, isDeleted: true, deletedAt: oldDate },
      { title: 'Note 3', content: '<p>3</p>', user: userId, isDeleted: true, deletedAt: oldDate }
    ])

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await Note.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    })

    expect(result.deletedCount).to.equal(3)
  })

  it('should keep recent notes when deleting old ones', async () => {
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 31)

    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 5)

    // one old note and one recent note
    await Note.create([
      { title: 'Old Note', content: '<p>Old</p>', user: userId, isDeleted: true, deletedAt: oldDate },
      { title: 'Recent Note', content: '<p>Recent</p>', user: userId, isDeleted: true, deletedAt: recentDate }
    ])

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await Note.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    })

    // only recent note should remain
    const remaining = await Note.find({ isDeleted: true })
    expect(remaining).to.have.lengthOf(1)
    expect(remaining[0].title).to.equal('Recent Note')
  })

})