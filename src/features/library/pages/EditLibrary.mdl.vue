<script setup>
import { ModalParent, closeModal } from '@customizer/modal-x';
import { useApiRequest } from '@/composables/useApiRequest';
import { toasted } from '@/utils/utils.js';
import { useLibrary } from '../store/libraryStore';
import NewFormParent from '../../roles/components/NewFormParent.vue';
import Button from '@/components/Button.vue';
import { useForm } from '@/components/new_form_builder/useForm';
import LibraryForm from '../components/libraryForm.vue';
import { updateLibraryById } from '../api/libraryApi';
import { emitEntityMutation } from '@/utils/entitySync';

const modalName = 'EditLibrary';
const libraryStore = useLibrary();
const { submit } = useForm('libraryform');

const updateReq = useApiRequest();

function getLibraryId(library) {
  return library?.id || library?.uuid || library?.libraryUuid;
}

function update({ values }, libraryId, currentLibrary = {}) {
  if (!libraryId) {
    toasted(false, '', 'Library id is missing.');
    return;
  }

  updateReq.send(
    () => updateLibraryById(libraryId, values),
    (res) => {
      toasted(res.success, 'Successfully Updated', res.error);
      if (res.success) {
        const updatedLibrary = res.data || { ...(currentLibrary || {}), ...values };
        libraryStore.update(libraryId, updatedLibrary);
        emitEntityMutation('libraries', { action: 'updated', id: libraryId });
        closeModal();
      }
    }
  );
}
</script>

<template>
  <ModalParent v-slot="{ data }" :name="modalName" class="bg-black/50 min-h-full p-4 sm:p-6 md:p-10 grid place-items-center">
    <NewFormParent title="Update Library" size="md">
      <LibraryForm
        :library="data?.library || {}"
      />

      <div class="p-4 sm:p-6 pt-0">
        <Button
          type="secondary"
          class="w-full"
          :pending="updateReq.pending.value"
          @click.prevent="submit((payload) => update(payload, getLibraryId(data?.library), data?.library || {}))"
        >
          Update Library
        </Button>
      </div>
    </NewFormParent>
  </ModalParent>
</template>
