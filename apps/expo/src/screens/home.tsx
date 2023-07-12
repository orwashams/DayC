import React, { useState } from "react";

import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import { trpc } from "../utils/trpc";
import { Workday } from "@prisma/client";

enum Month {
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="flex items-center justify-center p-1">
      <TouchableOpacity
        className="flex w-24 items-center justify-center rounded-full  bg-[#cc66ff] p-2"
        onPress={() => {
          signOut();
        }}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
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
        className="flex-auto rounded border-2 border-gray-500 p-2 text-white"
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

  const [monthsMap, setMonthsMap] = useState<Map<Month, Array<Workday>>>(
    new Map(),
  );

  React.useEffect(() => {
    const tempMap = new Map<Month, Array<Workday>>(monthsMap);

    workdayQuery.data?.forEach((workday) => {
      const month = workday.createdAt.toLocaleString("default", {
        month: "long",
      }) as Month;

      console.log(month);

      const monthArray = tempMap.get(month);
      if (monthArray) {
        monthArray.push(workday);
      } else {
        tempMap.set(month, [workday]);
      }
    });

    setMonthsMap(tempMap);
  }, [workdayQuery.data]);

  React.useEffect(() => {
    console.log(monthsMap);
  }, [monthsMap]);

  return (
    <SafeAreaView className="bg-[#2d3748]">
      <View className="mt-6 mb-4 px-4">
        <TouchableOpacity>
          <Entypo name="menu" size={28} color={"#cc66ff"} />
        </TouchableOpacity>
      </View>
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
