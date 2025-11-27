import React, { useCallback } from "react";
import { Alert, Text, View } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";

import Button from "@/src/components/Button";
import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/hooks/useTheme";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";

WebBrowser.maybeCompleteAuthSession();


const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params as Record<string, string | undefined>;

  if (!access_token) {
    console.warn("No access_token found in callback URL");
    return;
  }

  console.log("Got tokens from URL", { access_token: !!access_token, refresh_token: !!refresh_token });

  const { data, error } = await supabase.auth.setSession({
    // cast to any to avoid TS complaints; this matches Supabase’s own JS example
    access_token: access_token as string,
    refresh_token: (refresh_token ?? "") as string,
  } as any);

  console.log("setSession result", { error, session: data?.session });

  if (error) throw error;
};

export default function ConnectScreen() {
  const { colors, spacing, typography } = useTheme();
  const { user } = useAuth();

  const handleConnectGoogle = useCallback(async () => {
    try {
      const redirectTo = "timely://auth-callback"; // must be in Supabase Redirect URLs

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          scopes:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("Supabase signInWithOAuth error:", error);
        Alert.alert("Error", error.message ?? "Google sign-in failed");
        return;
      }

      if (!data?.url) {
        console.warn("signInWithOAuth returned no URL:", data);
        Alert.alert("Error", "No OAuth URL returned from Supabase");
        return;
      }

      console.log("Opening OAuth URL", data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log("Auth session result", result);

      if (result.type === "success" && result.url) {
        await createSessionFromUrl(result.url);
      }
    } catch (e: any) {
      console.error("Unexpected error in handleConnectGoogle:", e);
      Alert.alert("Error", e.message ?? "Unexpected error during sign-in");
    }
  }, []);


  return (
    <Screen>
      <Text
        style={{
          fontSize: typography.h1,
          fontWeight: "700",
          color: colors.text,
        }}
      >
        Connect Calendar
      </Text>
      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.subtext, marginBottom: spacing.lg }}>
        {user
          ? "Google is connected. Timely can read your upcoming events."
          : "Sign in with Google to let Timely read your upcoming events."}
      </Text>

      <Button
        title={user ? "Re-connect Google" : "Sign in with Google"}
        onPress={handleConnectGoogle}
      />
    </Screen>
  );
}
