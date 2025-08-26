<script setup lang="ts">
import Button from '@/components/Button.vue';
import Input from '@/components/new_form_elements/Input.vue';
import InputPassword from '@/components/new_form_elements/InputPassword.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import { closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { CreateUser } from '../Api/UserApi';
import { useUsers } from '../store/userStore';
import { allRequest, toasted } from '@/utils/utils';
import { useForm } from '@/components/new_form_builder/useForm';
import { getAllRole } from '../../roles/Api/RoleApi';
// import { getAllBranches } from '@/features/StoreKeeper/api/BranchesApi';

const { submit } = useForm('addform')

const user = useUsers()
const req = useApiRequest();
const rolereq = useApiRequest();
rolereq.send(() => allRequest({
    roles: getAllRole({ page: 1, limit: 500 }),
})
)

function create({ values }) {
    req.send(
        () => CreateUser(values),
        (res) => {
            if (res.success) {
                user.add(res.data);
            }
            toasted(res.success, 'User Created', res.error);
            closeModal();
        }
    );
}

</script>

<template>
    <div class="bg-black/50 min-h-full p-10 grid place-items-center">
        <NewFormParent title="Add User" size="lg">
            <Form :inner='false' v-slot="{ submit }" class="grid grid-cols-3 gap-5 mt-3 p-6" id="addform">
                <Input name="email" validation="required|email" label="Email" :attributes="{
                    placeholder: 'Enter User Email',
                }" />
                <InputPassword name="password" label="Password" validation="required|pass"
                    :attributes="{ placeholder: 'Password' }" />
                <Select name="title" label="Title" validation="required" :options="['mr.', 'ms.', 'dr.', 'prof']"
                    :attributes="{
                        type: 'text',
                        placeholder: 'title',
                    }">
                </Select>
                <Input name="firstName" validation="required|alpha" label="First Name" :attributes="{
                    placeholder: 'Enter firstname',
                }" />
                <Input name="fatherName" validation="required|alpha" label="Father Name" :attributes="{
                    placeholder: 'Enter fathername',
                }" />
                <Input name="grandFatherName" validation="required|alpha" label="Grandfather Name" :attributes="{
                    placeholder: 'Enter grandfathername',
                }" />
                <Select name="gender" label="Gender" validation="required" :options="['Female', 'Male']" :attributes="{
                    type: 'text',
                    placeholder: '',
                }">
                </Select>

                <Input name="mobilePhone" label="Mobile Phone" validation="required|phone" :attributes="{
                    placeholder: 'mobile phone',
                }" />
                <Select :obj="true" name="roleUuid" label="Role" validation="required"
                    :options="(rolereq.response.value?.roles?.content || []).map(role => ({ label: role.roleName, value: role.roleUuid }))"
                    :attributes="{
                        placeholder: 'Select Role',
                    }">
                </Select>
                <!-- <Select name="userStatus" label="User Status" validation="required"
                    :options="['ACTIVE', 'HISTORY', 'SUSPENDED', 'PENDING']" :attributes="{
                        type: 'text',
                        placeholder: 'status',
                    }">
                </Select> -->
                <!-- <Select name="userType" label="User Type" validation="required"
                    :options="['Physician', 'Admin', 'SuperAdmin', 'Cashier', 'Patient', 'Payer', 'StoreKeeper', 'Pharmacist']"
                    :attributes="{
                        type: 'text',
                        placeholder: 'user type',
                    }">
                </Select>
                <Select :obj="true" name="branchUuid" label="Branch" validation="required"
                    :options="(rolereq.response.value?.pharmacy?.content || []).map(pharma => ({ label: pharma.branchName, value: pharma.branchUuid }))"
                    :attributes="{
                        placeholder: 'Select Branch',
                    }">
                </Select> -->
            </Form>
            <template #bottom>
                <div class="p-2  ">
                    <Button type="secondary" :pending="req.pending.value" @click.prevent="submit(create)"
                        class="w-full">
                        Add User
                    </Button>
                </div>
            </template>
        </NewFormParent>
    </div>
</template>