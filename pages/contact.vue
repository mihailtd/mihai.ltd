<template>
  <div class="py-12">
    <h1
      class="mt-12 text-balance text-center text-6xl font-bold text-yellow-100 lg:text-9xl"
    >
      Don't hesitate to reach out!
    </h1>

    <div
      class="mt-16 grid grid-cols-1 items-center justify-center gap-16 lg:grid-cols-2"
    >
      <form
        ref="contactForm"
        class="mx-auto flex w-fit flex-col items-center justify-center rounded-3xl bg-black/30 p-8"
        @submit.prevent="submit"
      >
        <label class="flex w-64 flex-col py-2 lg:w-96"
          ><span class="pb-2">name *</span
          ><input
            v-model="name"
            required
            class="rounded-md px-2 py-1 text-black placeholder:text-gray-500"
            placeholder="name"
          />
        </label>
        <label class="flex w-64 flex-col py-2 lg:w-96"
          ><span class="pb-2">e-mail address *</span
          ><input
            v-model="email"
            required
            class="rounded-md px-2 py-1 text-black placeholder:text-gray-500"
            placeholder="email address"
            type="email"
          />
        </label>
        <label class="flex w-64 flex-col py-2 lg:w-96">
          <span class="pb-2">message *</span>
          <textarea
            v-model="message"
            required
            class="appearance-none rounded-md border-none px-2 py-1 text-black placeholder:text-gray-500"
            placeholder="message"
            rows="3"
            minlength="3"
            maxlength="500"
          ></textarea>
        </label>
        <div class="py-2"></div>
        <NuxtTurnstile ref="turnstile" v-model="token" class="pb-4" />
        <button
          type="submit"
          class="rounded-full bg-orange-500 px-4 py-1 text-lg font-bold duration-500 hover:bg-opacity-80"
        >
          Send
        </button>
      </form>
      <img
        class="mx-auto hidden lg:block"
        src="/images/Mail sent-amico.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const contactForm = ref<HTMLFormElement | null>(null);
const name = ref("");
const email = ref("");
const message = ref("");
const token = ref("");
const turnstile = ref();

const query = gql`
  mutation ($input: create_mihai_ltd_contact_messages_input!) {
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
