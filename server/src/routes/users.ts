import { addScopes, createUser, deleteUser, getById, getUsers, login } from "../controllers/users"
import { Router } from "express"
import { authorize } from "../middlewares/auth"
const router = Router()

router.route("/").get(authorize(["owner", "admin"]), async (req, res) => {
  await getUsers(req, res)
})

router.route("/getById/:id").get(authorize(["owner", "admin"]), async (req, res) => {
  await getById(req, res)
})

router.post("/register", async (req, res) => {
  createUser(req, res)
})

router.delete("/:userId", async (req, res) => {
  deleteUser(req, res)
})

router.post("/login", async (req, res) => {
  login(req, res)
})

router.route("/addScopes").post(async (req, res) => {
  await addScopes(req, res)
})


export default router