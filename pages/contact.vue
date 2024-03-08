<template>
  <NuxtLayout name="home" message="Don't hesitate to reach out!">
    <div
      class="grid grid-cols-1 items-center justify-center py-16 lg:grid-cols-2"
    >
      <form
        ref="contactForm"
        class="mx-auto flex w-fit flex-col items-center rounded-3xl bg-black/30 px-12 py-8"
        @submit.prevent="submit"
      >
        <label class="flex w-64 flex-col py-2 lg:w-96"
          ><span>name *</span>
          <input
            v-model="name"
            required
            class="rounded-md px-2 py-1 text-black placeholder:text-gray-500"
            placeholder="name"
            type="text"
        /></label>
        <label class="flex w-64 flex-col py-2 lg:w-96"
          ><span class="pb-1">email address *</span>
          <input
            v-model="email"
            required
            class="rounded-md px-2 py-1 text-black placeholder:text-gray-500"
            placeholder="email address"
            type="email"
        /></label>
        <label class="flex w-64 flex-col py-2 lg:w-96"
          ><span class="pb-1">message *</span
          ><textarea
            v-model="message"
            required
            class="rounded-md px-2 py-1 text-black placeholder:text-gray-500"
            rows="3"
            minlength="3"
            maxlength="500"
            placeholder="message"
            type="text"
          />
        </label>
        <div class="py-2"></div>
        <NuxtTurnstile ref="turnstile" v-model="token" class="pb-4" />
        <button
          type="submit"
          class="rounded-full bg-orange-500 px-4 py-1 text-lg font-bold duration-500 hover:bg-opacity-80"
        >
          Send message
        </button>
      </form>
      <img
        class="mx-auto hidden lg:block xl:max-w-[500px]"
        src="/images/mail-sending-illustration.svg"
        alt="sendimg email illustration"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const contactForm = ref<HTMLFormElement | null>(null);

const name = ref<string>("");
const email = ref<string>("");
const message = ref<string>("");
const token = ref("");
const turnstile = ref();

const query = gql`
  mutation createMessage($input: create_mihai_ltd_contact_messages_input!) {
    create_mihai_ltd_contact_messages_item(data: $input)
  }
`;

const { mutate: sendMessage } = useMutation(query);

const submit = async () => {
  if (contactForm.value?.checkValidity()) {
    turnstile.value?.reset();
    try {
      await sendMessage({
        input: {
          name: name.value,
          email: email.value,
          message: message.value,
        },
      });

      name.value = "";
      email.value = "";
      message.value = "";
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
