"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/services/authContext";
import { getWorkspaceOverview } from "@/services/workspaceApi";
import { setWorkspaceData, setWorkspaceLoading, setWorkspaceError } from "@/dashboard/store/dashboardSlice";

export function useWorkspaceOverview() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const loading = useSelector((s) => s.dashboard?.workspaceLoading);

  const refresh = useCallback(async () => {
    if (!user?.token) return;
    dispatch(setWorkspaceLoading(true));
    dispatch(setWorkspaceError(null));
    try {
      const data = await getWorkspaceOverview();
      dispatch(setWorkspaceData(data));
    } catch (err) {
      dispatch(setWorkspaceError(err.message));
    } finally {
      dispatch(setWorkspaceLoading(false));
    }
  }, [user?.token, dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { refresh, loading };
}