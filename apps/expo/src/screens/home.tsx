import React from "react";

import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import { trpc } from "../utils/trpc";
import { Workday } from "@prisma/client";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const WorkdayCard: React.FC<{
  workday: Workday;
}> = ({ workday }) => {
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Text className="text-xl font-semibold text-[#cc66ff]">
        {workday.note}
      </Text>
      <Text className="text-white">
        {workday.createdAt.toLocaleDateString()}
      </Text>
    </View>
  );
};

const CreateWorkday: React.FC = () => {
  const utils = trpc.useContext();
  const { mutate } = trpc.workday.create.useMutation({
    async onSuccess() {
      await utils.workday.all.invalidate();
    },
  });

  const [note, onChangeNote] = React.useState("");

  return (
    <View className="mb-3 flex w-full flex-row">
      <TextInput
        className="  flex-auto rounded border-2 border-gray-500 p-2 text-white"
        onChangeText={onChangeNote}
        placeholder="Note"
        placeholderTextColor={"#FFF"}
        clearButtonMode="always"
      />
      <TouchableOpacity
        className="ml-2 w-20 items-center justify-center rounded bg-[#cc66ff] p-2"
        onPress={() => {
          mutate({
            note,
          });
        }}
      >
        <Text>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const workdayQuery = trpc.workday.all.useQuery();

  return (
    <SafeAreaView className="bg-[#2d3748]">
      <View className="h-full w-full p-4">
        <CreateWorkday />

        <FlashList
          data={workdayQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(d) => (
            <TouchableOpacity>
              <WorkdayCard workday={d.item} />
            </TouchableOpacity>
          )}
        />

        <SignOut />
      </View>
    </SafeAreaView>
  );
};
